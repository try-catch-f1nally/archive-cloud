import {Application, Log4jsService, AuthMiddleware} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import MongoDb from './mongoDb';
import Kafka from './kafka';

import ArchiveModel from './storage/archive.model';
import StorageServiceImpl from './storage/storage.service';
import StorageController from './storage/storage.controller';

const log4jsService = new Log4jsService(config);
const authMiddleware = new AuthMiddleware(config);
const mongoDb = new MongoDb(config, log4jsService.getLogger('MongoDB'));
const kafka = new Kafka(config, log4jsService.getLogger('Kafka'));

const storageService = new StorageServiceImpl(config, ArchiveModel, kafka.consumer);
const storageController = new StorageController(config, storageService, authMiddleware);

void new Application({
  controllers: [storageController],
  logger: log4jsService.getLogger('Application'),
  connectableServices: [mongoDb, kafka],
  startableServices: [storageService],
  config
}).start();
