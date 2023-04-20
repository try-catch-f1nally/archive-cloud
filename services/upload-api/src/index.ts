import {Application, Log4jsService, AjvService, AuthMiddleware} from '@try-catch-f1nally/express-microservice';
import {config} from './config/config';
import Redis from './redis';

import UploadValidatorImpl from './upload/upload.validator';
import UploadServiceImpl from './upload/upload.service';
import UploadController from './upload/upload.controller';

const ajvService = new AjvService(config);
const log4jsService = new Log4jsService(config);
const authMiddleware = new AuthMiddleware(config);
const redis = new Redis(config, log4jsService.getLogger('Redis'));

const uploadValidator = new UploadValidatorImpl(ajvService);
const uploadService = new UploadServiceImpl(config, log4jsService.getLogger('UploadService'), redis.client);
const uploadController = new UploadController(config, uploadService, uploadValidator, authMiddleware);

void new Application({
  controllers: [uploadController],
  logger: log4jsService.getLogger('Application'),
  database: redis,
  config
}).start();
