import * as ioredis from 'ioredis';
import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export default interface Config extends DefaultConfig {
  port: number;
  redis: {
    connectionOptions: ioredis.RedisOptions;
  };
  'storage-api': {
    url: string;
  };
  upload: {
    path: string;
    fileSizeLimit: number;
  };
  storage: {
    path: string;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
}

export interface EnvVars {
  PORT: number;
  AUTH_PUBLIC_KEY: string;
  FRONTEND_ORIGIN: string;
  STORAGE_API_ORIGIN: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}
