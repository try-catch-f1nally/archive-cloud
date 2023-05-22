import * as kafkajs from 'kafkajs';
import {Connectable, Logger} from '@try-catch-f1nally/express-microservice';
import Config from './config/types/config.interface';

export interface KafkaProducer extends kafkajs.Producer {}

export default class Kafka implements Connectable {
  private _producer: kafkajs.Producer;
  private _config: Config;
  private _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._config = config;
    this._logger = logger;
    const kafka = new kafkajs.Kafka(this._config.kafka.connectionOptions);
    this._producer = kafka.producer();
  }

  get producer() {
    return this._producer;
  }

  async connect() {
    this._logger.info('Connecting to Kafka as producer...');
    await this._producer.connect();
    this._logger.info('Successfully connected to Kafka as producer');
  }

  async disconnect() {
    this._logger.info('Disconnecting from Kafka as producer...');
    await this._producer.disconnect();
    this._logger.info('Successfully disconnected from Kafka as producer');
  }
}
