import {StorageService} from "./types/storage.service.interface";
import ArchiveModel, {ArchiveDocument} from "../archive/types/archive.model.interface";
import path from "path";
import {Config} from "../config/types/config.interface";
import fs from "fs/promises";
import {BadRequestError} from "@try-catch-f1nally/express-microservice";

export default class StorageServiceImpl implements StorageService {
  private _config: Config;
  private _archiveModel: ArchiveModel;

  constructor(
    config: Config,
    archiveModel: ArchiveModel
  ) {
    this._config = config;
    this._archiveModel = archiveModel;
  }

  async getUserArchives(userId: string): Promise<ArchiveDocument[]> {
    return this._archiveModel.find({
      userId
    });
  }

  async deleteArchive(_id: string, userId: string): Promise<void> {
    const archive = await this._archiveModel.findOne({_id, userId});
    if (!archive) {
      throw new BadRequestError('Archive not found!');
    }
    const archiveDestination = path.join(this._config.storage.path, userId, archive.name);
    await fs.rm(archiveDestination, {recursive: true, force: true});
    await this._archiveModel.deleteOne({_id, userId});
  }

  async postArchive(userId: string, name: string): Promise<void> {
    const archivePath = path.join(this._config.storage.path, userId, name);
    await this._archiveModel.create({
      userId,
      name,
      sizeInBytes: (await fs.stat(archivePath)).size,
      createdAt: new Date()
    });
  }
}
