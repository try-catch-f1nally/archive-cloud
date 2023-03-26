import {Application, Log4jsService, AjvService, AuthMiddleware} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import MongoDB from './database';
import ArchiveModel from './archive/archive.model';
import UploadModel from './upload/upload.model';
import UploadValidatorImpl from './upload/upload.validator';
import UploadServiceImpl from './upload/upload.service';
import UploadController from './upload/upload.controller';

const ajvService = new AjvService();
const log4jsService = new Log4jsService(config);
const authMiddleware = new AuthMiddleware(config);
const mongoDb = new MongoDB(config, log4jsService.getLogger('MongoDB'));
const uploadValidator = new UploadValidatorImpl(ajvService);
const uploadService = new UploadServiceImpl(
  config,
  log4jsService.getLogger('UploadService'),
  UploadModel,
  ArchiveModel
);
const uploadController = new UploadController(config, uploadService, uploadValidator, authMiddleware);

new Application({
  controllers: [uploadController],
  logger: log4jsService.getLogger('Application'),
  database: mongoDb
}).start();
