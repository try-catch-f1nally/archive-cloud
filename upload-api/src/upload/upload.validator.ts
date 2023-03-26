import UploadValidator from './types/upload.validator.interface';
import {JSONSchema, ValidationFunction, ValidationService} from '@try-catch-f1nally/express-microservice';
import {SUPPORTED_ARCHIVE_FORMATS, UploadOptions} from './types/upload.types';

export default class UploadValidatorImpl implements UploadValidator {
  private _validationService: ValidationService;
  public validateUpload: ValidationFunction<UploadOptions>;

  constructor(validationService: ValidationService) {
    this._validationService = validationService;
    this.validateUpload = this._compileUploadValidator();
  }

  private _compileUploadValidator() {
    const schema: JSONSchema<UploadOptions> = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'regex',
          pattern: '^[A-Za-z-_]+$',
          minLength: 3,
          maxLength: 20,
          errorMessage: {
            type: 'archive name must be type of string',
            regex: 'archive name must include Latin letters and "-", "_" signs only',
            minLength: 'archive name must not be longer than 20 characters',
            maxLength: 'archive name must not be shorter than 3 characters'
          }
        },
        format: {
          type: 'string',
          enum: SUPPORTED_ARCHIVE_FORMATS,
          errorMessage: {
            type: 'archive format must be type of string',
            enum: `archive format must be one of ${SUPPORTED_ARCHIVE_FORMATS.join(',')}`
          }
        },
        password: {
          type: 'string',
          nullable: true,
          errorMessage: {
            type: 'archive password must be type of string'
          }
        }
      },
      required: ['name', 'format'],
      errorMessage: {
        required: {
          name: 'no archive name specified',
          format: 'no archive format specified'
        }
      }
    };
    return this._validationService.getValidator(schema);
  }
}
