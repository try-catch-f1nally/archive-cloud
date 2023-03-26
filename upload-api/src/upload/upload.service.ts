import path from 'path';
import fs from 'fs/promises';
import {path7za} from '7zip-bin';
import node7z from 'node-7z';
import {BadRequestError, Logger} from '@try-catch-f1nally/express-microservice';
import {Config} from '../config/types/config.interface';
import UploadService from './types/upload.service.interface';
import UploadModel from './types/upload.model.interface';
import {UploadOptions} from './types/upload.types';
import ArchiveModel from '../archive/types/archive.model.interface';

export default class UploadServiceImpl implements UploadService {
  private _config: Config;
  private _logger: Logger;
  private _uploadModel: UploadModel;
  private _archiveModel: ArchiveModel;

  constructor(config: Config, logger: Logger, uploadModel: UploadModel, archiveModel: ArchiveModel) {
    this._config = config;
    this._logger = logger;
    this._uploadModel = uploadModel;
    this._archiveModel = archiveModel;
  }

  getUserUploadDir(userId: string) {
    return path.join(this._config.upload.path, userId);
  }

  async prepareUserUploadDir(userId: string) {
    const userDir = this.getUserUploadDir(userId);
    try {
      await fs.rm(userDir, {recursive: true});
    } catch (error) {
      if (error instanceof Object && 'code' in error && error.code === 'EBUSY') {
        throw new BadRequestError('Please wait for the completion of your previous upload request');
      }
    }
    await fs.mkdir(userDir, {recursive: true});
  }

  async upload(userId: string, {name, format, password}: UploadOptions) {
    const userDir = this.getUserUploadDir(userId);
    const [archiveType, compressionExt] = format.split('.');
    const withCompression = !!compressionExt;
    const destDir = path.join(this._config.storage.path, userId);
    const archive = `${destDir}${path.sep}${name}.${archiveType}`;
    const compressedArchive = `${destDir}${path.sep}${name}.${format}`;
    const source = `${userDir}${path.sep}*.*`;
    const zipOptions = {
      $bin: path7za,
      $progress: true,
      recursive: true,
      password,
      method: password && format === '7z' ? ['he'] : []
    };
    const upload = await this._uploadModel.create({
      userId,
      name,
      withCompression,
      status: 'process',
      archivingProgress: 0,
      compressionProgress: 0,
      createdAt: new Date()
    });

    const finishUpload = async () => {
      upload.status = 'success';
      await upload.save();
      await this._archiveModel.create({
        userId,
        name,
        sizeInBytes: (await fs.stat(compressedArchive)).size,
        createdAt: new Date()
      });
    };

    const runCompressing = () =>
      node7z
        .add(compressedArchive, archive, zipOptions)
        .on('progress', async ({percent}) => {
          upload.compressionProgress = percent;
          await upload.save();
        })
        .on('error', async (error: unknown) => {
          upload.status = 'error';
          await upload.save();
          this._logger.debug(`Error on creating archive ${compressedArchive}`, error);
          await fs.rm(userDir, {recursive: true, force: true});
        })
        .on('end', () => finishUpload());

    node7z
      .add(archive, source, zipOptions)
      .on('progress', async ({percent}) => {
        upload.archivingProgress = percent;
        await upload.save();
      })
      .on('error', async (error: unknown) => {
        upload.status = 'error';
        await upload.save();
        this._logger.debug(`Error on creating archive ${archive}`, error);
        await fs.rm(userDir, {recursive: true, force: true});
      })
      .on('end', () => (withCompression ? runCompressing() : finishUpload()));
  }

  async getUploadingProgress(userId: string) {
    const upload = await this._uploadModel.findOne({userId});
    if (!upload) {
      throw new BadRequestError('There are no uploads for this user');
    }
    return upload.getProgress();
  }
}
