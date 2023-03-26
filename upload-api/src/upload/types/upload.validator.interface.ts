import {ValidationFunction} from '@try-catch-f1nally/express-microservice';
import {UploadOptions} from './upload.types';

export default interface UploadValidator {
  validateUpload: ValidationFunction<UploadOptions>;
}
