import * as dotenv from 'dotenv';
dotenv.config({path: '.env.dev'});
import {processEnvValidator} from '@try-catch-f1nally/express-microservice';
import Config, {EnvVars} from './types/config.interface';

const envVars = processEnvValidator<EnvVars>({
  type: 'object',
  properties: {
    PORT: {type: 'integer', default: 3000},
    MONGODB_URI: {type: 'string', format: 'uri'},
    AUTH_PUBLIC_KEY: {type: 'string'},
    AUTH_PRIVATE_KEY: {type: 'string'},
    JWT_SECRET: {type: 'string'},
    FRONTEND_ORIGIN: {type: 'string'}
  },
  required: ['MONGODB_URI', 'AUTH_PUBLIC_KEY', 'AUTH_PRIVATE_KEY', 'JWT_SECRET', 'FRONTEND_ORIGIN']
});

export const config: Config = {
  port: envVars.PORT,
  mongodb: {
    uri: envVars.MONGODB_URI
  },
  auth: {
    publicKey: envVars.AUTH_PUBLIC_KEY,
    privateKey: envVars.AUTH_PRIVATE_KEY,
    refreshSecret: envVars.JWT_SECRET,
    accessTokenTtlInSeconds: 30 * 60,
    refreshTokenTtlInSeconds: 30 * 24 * 60 * 60
  },
  cors: {
    origin: envVars.FRONTEND_ORIGIN,
    credentials: true
  }
};
