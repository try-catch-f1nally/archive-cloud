import {Config} from './types/config.interface';

export const config: Config = {
  dbUri: process.env.DB_URI!,
  auth: {
    publicKey: process.env.AUTH_PUBLIC_KEY!
  },
  upload: {
    path: './uploads'
  },
  storage: {
    path: './archives',
    fileSizeLimit: 2 * 1024 * 1024 * 1024
  }
};
