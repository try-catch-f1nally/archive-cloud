import * as dotenv from 'dotenv';
dotenv.config({path: '.env.dev'});
import {Config} from './types/config.interface';

export const config: Config = {
  dbUri: process.env.DB_URI!,
  auth: {
    publicKey: process.env.AUTH_PUBLIC_KEY!,
    privateKey: process.env.AUTH_PRIVATE_KEY!,
    refreshSecret: process.env.JWT_SECRET!,
    accessTokenTtlInSeconds: 30 * 60,
    refreshTokenTtlInSeconds: 30 * 24 * 60 * 60
  }
};
