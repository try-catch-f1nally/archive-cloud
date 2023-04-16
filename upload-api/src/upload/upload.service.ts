import path from 'node:path';
import fs from 'node:fs/promises';
import http from 'node:http';
import {path7za} from '7zip-bin';
import node7z from 'node-7z';
import {BadRequestError, Logger} from '@try-catch-f1nally/express-microservice';
import Config from '../config/types/config.interface';
import UploadService from './types/upload.service.interface';
import {UploadingStatus, UploadOptions} from './types/upload.types';
import {RedisClient} from '../redis';

export default class UploadServiceImpl implements UploadService {
  private _config: Config;
  private _logger: Logger;
  private _redisClient: RedisClient;

  constructor(config: Config, logger: Logger, redisClient: RedisClient) {
    this._config = config;
    this._logger = logger;
    this._redisClient = redisClient;
  }

  getUserUploadDir(userId: string) {
    return path.resolve(this._config.upload.path, userId);
  }

  async prepareForUpload(userId: string) {
    const status = await this._redisClient.get(userId);
    if (status === 'process') {
      throw new BadRequestError('Please wait for the completion of your previous upload request');
    }
    await this._redisClient.del(userId);
    const userDir = this.getUserUploadDir(userId);
    await fs.rm(userDir, {force: true, recursive: true});
    await fs.mkdir(userDir, {recursive: true});
  }

  cleanUserUploadDir(userId: string) {
    return fs.rm(this.getUserUploadDir(userId), {force: true, recursive: true});
  }

  async upload(userId: string, {name, format, password}: UploadOptions) {
    const userDir = this.getUserUploadDir(userId);
    const archiveName = name + '.' + format;
    const [archiveType, compressionExt] = format.split('.');
    const archivePath = path.join(this._config.storage.path, userId, archiveName);
    const source = path.join(userDir, '*.*');
    const zipOptions = {
      $bin: path7za,
      recursive: true,
      workingDir: userDir,
      password,
      method: password && format === '7z' ? ['he'] : []
    };

    const redisKeyTtl = 4 * 60 * 60;
    await this._redisClient.set(userId, 'process', 'EX', redisKeyTtl);

    let errorOccurred = false;
    const handleEnd = async () => {
      try {
        if (!errorOccurred) {
          await this._notifyStorageApiService(userId, archiveName);
          await this._redisClient.set(userId, 'success', 'EX', redisKeyTtl);
        }
      } catch (error) {
        this._logger.error('Failed to handle "end" event on creating/compressing archive', error);
      } finally {
        await fs.rm(userDir, {recursive: true, force: true}).catch(() => `Failed to remove ${userDir}`);
      }
    };

    const handleError = async (error: unknown) => {
      try {
        errorOccurred = true;
        this._logger.debug(`Error on creating ${archivePath}`, error);
        await this._redisClient.set(userId, 'error', 'EX', redisKeyTtl);
      } catch (error) {
        this._logger.error('Failed to handle "error" event on creating/compressing archive', error);
      }
    };

    if (compressionExt) {
      const tempDir = path.resolve(this._config.upload.path, 'temp', userId);
      const tempArchivePath = path.join(tempDir, name + '.' + archiveType);
      node7z
        .add(tempArchivePath, source, zipOptions)
        .on('error', handleError)
        .on('end', () =>
          node7z.add(archivePath, tempArchivePath, zipOptions).on('error', handleError).on('end', handleEnd)
        );
    } else {
      node7z.add(archivePath, source, zipOptions).on('error', handleError).on('end', handleEnd);
    }
  }

  // TODO: replace http request with rabbitmq event
  _notifyStorageApiService(userId: string, name: string) {
    const data = JSON.stringify({userId, name});
    const req = http.request(`${this._config['storage-api'].url}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    });
    return new Promise((resolve, reject) => {
      req.on('error', reject).on('close', resolve);
      req.write(data);
      req.end();
    });
  }

  async getUploadingStatus(userId: string) {
    const status = await this._redisClient.get(userId);
    if (!status) {
      throw new BadRequestError('No uploads found');
    }
    return status as UploadingStatus;
  }
}
