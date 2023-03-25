import {JSONSchema, ValidationFunction, ValidationService} from '@try-catch-f1nally/express-microservice';
import AuthValidator from './types/auth.validator.interface';
import {LoginData, RegisterData} from './types/auth.types';

export default class AuthValidatorImpl implements AuthValidator {
  private _validationService: ValidationService;
  public validateRegisterData: ValidationFunction<RegisterData>;
  public validateLoginData: ValidationFunction<LoginData>;

  constructor(validationService: ValidationService) {
    this._validationService = validationService;
    this.validateRegisterData = this._compileRegisterValidator();
    this.validateLoginData = this._compileLoginValidator();
  }

  private _compileRegisterValidator() {
    const schema: JSONSchema<RegisterData> = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          errorMessage: 'invalid email format'
        },
        password: {
          type: 'string',
          minLength: 5,
          errorMessage: {
            type: 'password must be type of string',
            minLength: 'password must have more than 4 characters'
          }
        }
      },
      required: ['email', 'password'],
      errorMessage: {
        required: {
          email: 'no email specified',
          password: 'no password specified'
        }
      }
    };
    return this._validationService.getValidator(schema);
  }

  private _compileLoginValidator() {
    const schema: JSONSchema<LoginData> = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          errorMessage: 'email must be type of string'
        },
        password: {
          type: 'string',
          errorMessage: 'password must be type of string'
        }
      },
      required: ['email', 'password'],
      errorMessage: {
        required: {
          email: 'no email specified',
          password: 'no password specified'
        }
      }
    };
    return this._validationService.getValidator(schema);
  }
}
