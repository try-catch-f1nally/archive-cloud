import {Config as DefaultConfig} from '@try-catch-f1nally/express-microservice';

export interface Config extends DefaultConfig {
  port: number;
  dbUri: string;
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
