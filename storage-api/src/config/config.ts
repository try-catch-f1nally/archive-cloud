import dotenv from 'dotenv';
dotenv.config({path: '.env.dev'});
import {processEnvValidator} from '@try-catch-f1nally/express-microservice';
import Config, {EnvVars} from './types/config.interface';

const envVars = processEnvValidator<EnvVars>({
  type: 'object',
  properties: {
    PORT: {type: 'integer', default: 3000},
    MONGODB_URI: {type: 'string'},
    AUTH_PUBLIC_KEY: {type: 'string'},
    FRONTEND_ORIGIN: {type: 'string'}
  },
  required: ['MONGODB_URI', 'AUTH_PUBLIC_KEY', 'FRONTEND_ORIGIN']
});

export const config: Config = {
  port: envVars.PORT,
  mongodb: {
    uri: envVars.MONGODB_URI
  },
  auth: {
    publicKey: envVars.AUTH_PUBLIC_KEY
  },
  storage: {
    path: './archives'
  },
  cors: {
    origin: envVars.FRONTEND_ORIGIN,
    credentials: true
  }
};
