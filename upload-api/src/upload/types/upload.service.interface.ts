import {UploadingStatus, UploadOptions} from './upload.types';

export default interface UploadService {
  getUserUploadDir(userId: string): string;
  prepareUserUploadDir(userId: string): Promise<void>;
  upload(userId: string, uploadOptions: UploadOptions): void;
  getUploadingStatus(userId: string): Promise<UploadingStatus>;
}
