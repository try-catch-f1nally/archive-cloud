import {ValidationFunction} from '@try-catch-f1nally/express-microservice';

export default interface StorageValidator {
  validateDiscoverArchive: ValidationFunction<{userId: string; name: string}>;
}
