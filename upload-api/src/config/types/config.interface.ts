import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export interface Config extends DefaultConfig {
  dbUri: string;
  upload: {
    path: string;
  };
  storage: {
    path: string;
    fileSizeLimit: number;
  };
}
