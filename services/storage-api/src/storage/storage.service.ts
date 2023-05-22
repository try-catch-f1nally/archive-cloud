import fs from 'fs/promises';
import path from 'path';
import {BadRequestError, Startable} from '@try-catch-f1nally/express-microservice';
import Config from '../config/types/config.interface';
import ArchiveModel, {Archive} from './types/archive.model.interface';
import {StorageService} from './types/storage.service.interface';
import {KafkaConsumer} from '../kafka';

export default class StorageServiceImpl implements StorageService, Startable {
  private _config: Config;
  private _archiveModel: ArchiveModel;
  private _kafkaConsumer: KafkaConsumer;

  constructor(config: Config, archiveModel: ArchiveModel, kafkaConsumer: KafkaConsumer) {
    this._config = config;
    this._archiveModel = archiveModel;
    this._kafkaConsumer = kafkaConsumer;
  }

  async start() {
    await this._subscribeOnStorageTopic();
  }

  async stop() {
    await this._kafkaConsumer.stop();
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

  async _subscribeOnStorageTopic() {
    await this._kafkaConsumer.subscribe({topic: 'storage', fromBeginning: true});
    await this._kafkaConsumer.run({
      eachMessage: async ({topic, message}) => {
        if (topic === 'storage' && message.value) {
          const {userId, name} = JSON.parse(message.value.toString());
          const archivePath = path.join(this._config.storage.path, userId, name);
          const sizeInBytes = (await fs.stat(archivePath)).size;
          await this._archiveModel.create({userId, name, sizeInBytes});
        }
      }
    });
  }
}
