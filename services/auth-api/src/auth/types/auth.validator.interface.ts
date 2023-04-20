import {ValidationFunction} from '@try-catch-f1nally/express-microservice';
import {LoginData, RegisterData} from './auth.types';

export default interface AuthValidator {
  validateRegisterData: ValidationFunction<RegisterData>;
  validateLoginData: ValidationFunction<LoginData>;
}
