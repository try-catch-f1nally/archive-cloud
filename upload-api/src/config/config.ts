import dotenv from 'dotenv';
dotenv.config({path: '.env.dev'});
import {processEnvValidator} from '@try-catch-f1nally/express-microservice';
import Config, {EnvVars} from './types/config.interface';

const envVars = processEnvValidator<EnvVars>({
  type: 'object',
  properties: {
    PORT: {type: 'integer', default: 3000},
    AUTH_PUBLIC_KEY: {type: 'string'},
    FRONTEND_ORIGIN: {type: 'string'},
    STORAGE_API_ORIGIN: {type: 'string'},
    REDIS_HOST: {type: 'string', format: 'hostname'},
    REDIS_PORT: {type: 'integer'}
  },
  required: ['AUTH_PUBLIC_KEY', 'FRONTEND_ORIGIN', 'REDIS_HOST'],
  errorMessage: {
    properties: {
      PORT: 'invalid PORT env var',
      AUTH_PUBLIC_KEY: 'invalid AUTH_PUBLIC_KEY env var',
      FRONTEND_ORIGIN: 'invalid FRONTEND_ORIGIN env var',
      STORAGE_API_ORIGIN: 'invalid STORAGE_API_ORIGIN env var',
      REDIS_HOST: 'invalid REDIS_HOST env var',
      REDIS_PORT: 'invalid REDIS_PORT env var'
    }
  }
});

export const config: Config = {
  port: envVars.PORT, // default to 3000
  auth: {
    publicKey: envVars.AUTH_PUBLIC_KEY
  },
  redis: {
    connectionOptions: {
      host: envVars.REDIS_HOST,
      port: envVars.REDIS_PORT // default to 6379
    }
  },
  'storage-api': {
    url: envVars.STORAGE_API_ORIGIN
  },
  upload: {
    path: './uploads',
    fileSizeLimit: 2 * 1024 * 1024 * 1024
  },
  storage: {
    path: './archives'
  },
  cors: {
    origin: envVars.FRONTEND_ORIGIN,
    credentials: true
  }
};
