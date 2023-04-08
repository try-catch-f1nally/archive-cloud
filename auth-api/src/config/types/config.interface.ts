import mongoose from 'mongoose';
import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export default interface Config extends DefaultConfig {
  port: number;
  mongodb: {
    uri: string;
    connectionOptions?: mongoose.ConnectOptions;
  };
  auth: {
    publicKey: string;
    privateKey: string;
    refreshSecret: string;
    accessTokenTtlInSeconds: number;
    refreshTokenTtlInSeconds: number;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
}

export interface EnvVars {
  PORT: number;
  MONGODB_URI: string;
  AUTH_PUBLIC_KEY: string;
  AUTH_PRIVATE_KEY: string;
  JWT_SECRET: string;
  FRONTEND_ORIGIN: string;
}
