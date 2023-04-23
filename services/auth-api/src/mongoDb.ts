import mongoose from 'mongoose';
import {Database, Logger} from '@try-catch-f1nally/express-microservice';
import Config from './config/types/config.interface';

export default class MongoDB implements Database {
  private _config: Config;
  private _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._config = config;
    this._logger = logger;
  }

  async connect() {
    this._logger.info('Connecting to DB...');
    await mongoose.connect(this._config.mongodb.uri, this._config.mongodb.connectionOptions);
    this._logger.info('Successfully connected to MongoDB');
  }

  async close() {
    this._logger.info('Disconnecting from DB...');
    await mongoose.connection.close();
    this._logger.info('Successfully disconnected from MongoDB');
  }
}
