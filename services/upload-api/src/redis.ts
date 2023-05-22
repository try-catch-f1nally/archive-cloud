import * as ioredis from 'ioredis';
import {Connectable, Logger} from '@try-catch-f1nally/express-microservice';
import Config from './config/types/config.interface';

export interface RedisClient extends ioredis.Redis {}

export default class RedisDb implements Connectable {
  private _client: ioredis.Redis;
  private _config: Config;
  private _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._config = config;
    this._logger = logger;
    this._client = new ioredis.Redis(Object.assign(config.redis.connectionOptions, {lazyConnect: true}));
  }

  get client(): RedisClient {
    return this._client;
  }

  async connect() {
    this._logger.info('Connecting to Redis...');
    await this._client.connect();
    this._logger.info('Successfully connected to Redis');
  }

  async disconnect() {
    this._logger.info('Disconnecting from Redis...');
    await this._client.quit();
    this._logger.info('Successfully disconnected from Redis');
  }
}
