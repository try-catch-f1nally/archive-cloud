import {Application, Log4jsService, AjvService, AuthMiddleware} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import MongoDB from './database';
import ArchiveModel from './archive/archive.model';
import StorageController from "./storage/storage.controller";
import StorageServiceImpl from "./storage/storage.service";
import archiveModel from "./archive/archive.model";

const ajvService = new AjvService();
const log4jsService = new Log4jsService(config);
const authMiddleware = new AuthMiddleware(config);
const mongoDb = new MongoDB(config, log4jsService.getLogger('MongoDB'));

const storageService = new StorageServiceImpl(config, archiveModel);
const storageController = new StorageController(config, authMiddleware, storageService);

new Application({
  controllers: [
      storageController
  ],
  logger: log4jsService.getLogger('Application'),
  database: mongoDb,
  config
}).start();
