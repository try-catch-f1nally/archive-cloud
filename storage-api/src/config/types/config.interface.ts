import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export interface Config extends DefaultConfig {
  port: number;
  dbUri: string;
  storage: {
    path: string;
    fileSizeLimit: number;
  };
  cors: {
    origin: string;
    credentials: boolean;
  };
}
