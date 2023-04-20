import {UploadingStatus, UploadOptions} from './upload.types';

export default interface UploadService {
  getUserUploadDir(userId: string): string;
  prepareForUpload(userId: string): Promise<void>;
  cleanUserUploadDir(userId: string): Promise<void>;
  upload(userId: string, uploadOptions: UploadOptions): Promise<void>;
  getUploadingStatus(userId: string): Promise<UploadingStatus>;
}
