import {UploadingProgress, UploadOptions} from './upload.types';

export default interface UploadService {
  getUserUploadDir(userId: string): string;
  prepareUserUploadDir(userId: string): Promise<void>;
  upload(userId: string, uploadOptions: UploadOptions): void;
  getUploadingProgress(userId: string): Promise<UploadingProgress>;
}
