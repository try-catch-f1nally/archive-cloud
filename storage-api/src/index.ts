import {Application, Log4jsService, AjvService, AuthMiddleware} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import MongoDb from './mongodb';

import ArchiveModel from './storage/archive.model';
import StorageValidatorImpl from './storage/storage.validator';
import StorageServiceImpl from './storage/storage.service';
import StorageController from './storage/storage.controller';

const ajvService = new AjvService(config);
const log4jsService = new Log4jsService(config);
const authMiddleware = new AuthMiddleware(config);
const mongoDb = new MongoDb(config, log4jsService.getLogger('MongoDB'));

const storageValidator = new StorageValidatorImpl(ajvService);
const storageService = new StorageServiceImpl(config, ArchiveModel);
const storageController = new StorageController(config, storageService, storageValidator, authMiddleware);

void new Application({
  controllers: [storageController],
  logger: log4jsService.getLogger('Application'),
  database: mongoDb,
  config
}).start();
