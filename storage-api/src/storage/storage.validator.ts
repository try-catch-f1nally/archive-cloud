import StorageValidator from './types/storage.validator.interface';
import {JSONSchema, ValidationFunction, ValidationService} from '@try-catch-f1nally/express-microservice';

export default class StorageValidatorImpl implements StorageValidator {
  private _validationService: ValidationService;
  public validateDiscoverArchive: ValidationFunction<{userId: string; name: string}>;

  constructor(validationService: ValidationService) {
    this._validationService = validationService;
    this.validateDiscoverArchive = this._compileDiscoverArchiveValidator();
  }

  private _compileDiscoverArchiveValidator() {
    const schema: JSONSchema<{userId: string; name: string}> = {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          minLength: 8,
          maxLength: 64,
          errorMessage: {
            type: 'user id name must be type of string',
            minLength: 'archive name must not be shorter than 8 characters',
            maxLength: 'archive name must not be longer than 64 characters'
          }
        },
        name: {
          type: 'string',
          format: 'regex',
          pattern: '^[A-Za-z0-9-_.]+$',
          minLength: 3,
          maxLength: 20,
          errorMessage: {
            type: 'archive name must be type of string',
            pattern: 'archive name must include Latin letters, digits and "-", "_", "." signs only',
            minLength: 'archive name must not be shorter than 3 characters',
            maxLength: 'archive name must not be longer than 20 characters'
          }
        }
      },
      required: ['userId', 'name'],
      errorMessage: {
        required: {
          userId: 'no user id provided',
          name: 'no archive name provided'
        }
      }
    };
    return this._validationService.getValidator(schema);
  }
}
