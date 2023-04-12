import path from 'path';
import fs from 'fs/promises';
import http from 'http';
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
    return path.join(this._config.upload.path, userId);
  }

  async prepareUserUploadDir(userId: string) {
    const userDir = this.getUserUploadDir(userId);
    await fs.rm(userDir, {recursive: true}).catch((error) => {
      if (error instanceof Object && 'code' in error && error.code === 'EBUSY') {
        throw new BadRequestError('Please wait for the completion of your previous upload request');
      }
    });
    await fs.mkdir(userDir, {recursive: true});
  }

  async upload(userId: string, {name, format, password}: UploadOptions) {
    const userDir = this.getUserUploadDir(userId);
    const [archiveType, compressionExt] = format.split('.');
    const withCompression = !!compressionExt;
    const destDir = path.join(this._config.storage.path, userId);
    const archiveNameWithoutCompression = `${destDir}${path.sep}${name}.${archiveType}`;
    const archiveName = `${destDir}${path.sep}${name}.${format}`;
    const source = `${userDir}${path.sep}*.*`;
    const zipOptions = {
      $bin: path7za,
      recursive: true,
      password,
      method: password && format === '7z' ? ['he'] : []
    };

    const redisKeyTtl = 4 * 60 * 60;
    await this._redisClient.set(userId, 'process', 'EX', redisKeyTtl);

    const handleEnd = async () => {
      try {
        await fs.rm(userDir, {recursive: true, force: true});
        await this._notifyStorageApiService(userId, archiveName);
        await this._redisClient.set(userId, 'success', 'EX', redisKeyTtl);
      } catch (error) {
        this._logger.error('Failed to handle "end" event on creating/compressing archive', error);
      }
    };

    const handleError = async (error: unknown, message: string) => {
      try {
        this._logger.debug(message, error);
        await this._redisClient.set(userId, 'error', 'EX', redisKeyTtl);
        await fs.rm(userDir, {recursive: true, force: true});
      } catch (error) {
        this._logger.error('Failed to handle "error" event on creating/compressing archive', error);
      }
    };

    const runCompressing = () =>
      node7z
        .add(archiveName, archiveNameWithoutCompression, zipOptions)
        .on('error', async (error: unknown) => handleError(error, `Error on compressing ${archiveName}`))
        .on('end', () => handleEnd());

    node7z
      .add(archiveNameWithoutCompression, source, zipOptions)
      .on('error', async (error: unknown) => handleError(error, `Error on creating ${archiveNameWithoutCompression}`))
      .on('end', () => (withCompression ? runCompressing() : handleEnd()));
  }

  // TODO: replace http request with rabbitmq event
  _notifyStorageApiService(userId: string, archiveName: string) {
    const data = JSON.stringify({userId, archiveName});
    const req = http.request(this._config['storage-api'].url, {
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
