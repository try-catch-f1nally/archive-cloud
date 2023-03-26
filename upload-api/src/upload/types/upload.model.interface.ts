import {Document, Model, Schema} from 'mongoose';
import {UploadingProgress, UploadingStatus} from './upload.types';

export interface Upload {
  userId: Schema.Types.ObjectId;
  name: string;
  withCompression: boolean;
  status: UploadingStatus;
  errorMessage?: string;
  archivingProgress: number;
  compressionProgress: number;
  createdAt: Date;
}

export interface UploadDocument extends Upload, Document {
  getProgress(): UploadingProgress;
}

type UploadModel = Model<UploadDocument>;
export default UploadModel;
