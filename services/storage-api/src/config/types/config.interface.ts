import mongoose from 'mongoose';
import * as kafkajs from 'kafkajs';
import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export default interface Config extends DefaultConfig {
  port: number;
  mongodb: {
    uri: string;
    connectionOptions?: mongoose.ConnectOptions;
  };
  kafka: {
    connectionOptions: kafkajs.KafkaConfig;
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
  MONGODB_HOST: string;
  MONGODB_PORT: number;
  KAFKA_HOST: string;
  KAFKA_PORT: number;
  AUTH_PUBLIC_KEY: string;
  FRONTEND_ORIGIN: string;
}
