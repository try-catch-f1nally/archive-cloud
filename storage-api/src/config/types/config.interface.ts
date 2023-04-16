import mongoose from 'mongoose';
import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export default interface Config extends DefaultConfig {
  port: number;
  mongodb: {
    uri: string;
    connectionOptions?: mongoose.ConnectOptions;
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
  MONGODB_URI: string;
  AUTH_PUBLIC_KEY: string;
  FRONTEND_ORIGIN: string;
}
