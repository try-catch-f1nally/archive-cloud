import path from 'node:path';
import fs from 'node:fs/promises';
import {path7za} from '7zip-bin';
import node7z from 'node-7z';
import {BadRequestError, Logger} from '@try-catch-f1nally/express-microservice';
import Config from '../config/types/config.interface';
import UploadService from './types/upload.service.interface';
import {UploadingStatus, UploadOptions} from './types/upload.types';
import {RedisClient} from '../redis';
import {KafkaProducer} from '../kafka';

export default class UploadServiceImpl implements UploadService {
  private _config: Config;
  private _logger: Logger;
  private _redisClient: RedisClient;
  private _kafkaProducer: KafkaProducer;

  constructor(config: Config, logger: Logger, redisClient: RedisClient, kafkaProducer: KafkaProducer) {
    this._config = config;
    this._logger = logger;
    this._redisClient = redisClient;
    this._kafkaProducer = kafkaProducer;
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
    const archiveName = name + '.' + format;
    const [archiveType, compressionExt] = format.split('.');
    const uploadDir = this.getUserUploadDir(userId);
    const archiveDir = path.join(this._config.storage.path, userId);
    const archivePath = path.join(archiveDir, archiveName);
    await fs.mkdir(archiveDir, {recursive: true});
    const source = path.join(uploadDir, '*.*');
    const zipOptions = {
      $bin: path7za,
      recursive: true,
      workingDir: uploadDir,
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
        await fs.rm(uploadDir, {recursive: true, force: true}).catch(() => `Failed to remove ${uploadDir}`);
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

  _notifyStorageApiService(userId: string, name: string) {
    return this._kafkaProducer.send({
      topic: 'storage',
      messages: [{value: JSON.stringify({userId, name})}]
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
