import fs from 'fs/promises';
import path from 'path';
import {BadRequestError} from '@try-catch-f1nally/express-microservice';
import Config from '../config/types/config.interface';
import ArchiveModel, {Archive} from './types/archive.model.interface';
import {StorageService} from './types/storage.service.interface';

export default class StorageServiceImpl implements StorageService {
  private _config: Config;
  private _archiveModel: ArchiveModel;

  constructor(config: Config, archiveModel: ArchiveModel) {
    this._config = config;
    this._archiveModel = archiveModel;
  }

  async getUserArchives(userId: string): Promise<Archive[]> {
    return this._archiveModel.find({userId});
  }

  async deleteArchive(id: string): Promise<void> {
    const archive = await this._archiveModel.findByIdAndDelete(id);
    if (!archive) {
      throw new BadRequestError('No archive found');
    }
    const archiveDestination = path.join(this._config.storage.path, archive.userId, archive.name);
    await fs.rm(archiveDestination, {recursive: true, force: true});
  }

  async updateArchive(id: string, name: string): Promise<void> {
    const archive = await this._archiveModel.findById(id);
    if (!archive) {
      throw new BadRequestError('No archive found');
    }
    const archiveDestination = path.join(this._config.storage.path, archive.userId, archive.name);
    const newArchiveDestination = path.join(this._config.storage.path, archive.userId, name);
    await fs.rename(archiveDestination, newArchiveDestination);
    archive.name = name;
    await archive.save();
  }

  async discoverArchive(userId: string, name: string): Promise<void> {
    const archivePath = path.join(this._config.storage.path, userId, name);
    await this._archiveModel.create({
      userId,
      name,
      sizeInBytes: (await fs.stat(archivePath)).size,
      createdAt: new Date()
    });
  }
}
