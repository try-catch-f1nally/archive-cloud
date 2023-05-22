import * as kafkajs from 'kafkajs';
import {Connectable, Logger} from '@try-catch-f1nally/express-microservice';
import Config from './config/types/config.interface';

export interface KafkaConsumer extends kafkajs.Consumer {}

export default class Kafka implements Connectable {
  private _consumer: kafkajs.Consumer;
  private _config: Config;
  private _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._config = config;
    this._logger = logger;
    const kafka = new kafkajs.Kafka(this._config.kafka.connectionOptions);
    this._consumer = kafka.consumer({groupId: 'storage-api'});
  }

  get consumer() {
    return this._consumer;
  }

  async connect() {
    this._logger.info('Connecting to Kafka as consumer...');
    await this._consumer.connect();
    this._logger.info('Successfully connected to Kafka as consumer');
  }

  async disconnect() {
    this._logger.info('Disconnecting from Kafka as consumer...');
    await this._consumer.disconnect();
    this._logger.info('Successfully disconnected from Kafka as consumer');
  }
}
