import {model, Schema} from 'mongoose';
import UploadModel, {UploadDocument} from './types/upload.model.interface';

const UploadSchema = new Schema<UploadDocument, UploadModel>(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    name: {type: String, required: true, unique: true},
    withCompression: {type: Boolean, required: true},
    status: {type: String, required: true, enum: ['process', 'error', 'success']},
    errorMessage: {type: String, default: 'unknown error'},
    archivingProgress: {type: Number, required: true},
    compressionProgress: {type: Number, required: true},
    createdAt: {type: Date, required: true}
  },
  {
    methods: {
      getProgress() {
        if (this.status === 'process') {
          if (this.withCompression) {
            const percentage = Math.ceil(this.archivingProgress * 0.05 + this.compressionProgress * 0.95);
            return {status: 'process', percentage};
          }
          return {status: 'process', percentage: this.archivingProgress};
        }
        if (this.status === 'success') {
          return {status: 'success'};
        }
        return {status: 'error', errorMessage: this.errorMessage};
      }
    }
  }
);

UploadSchema.index({userId: 1});

export default model<UploadDocument, UploadModel>('Upload', UploadSchema);
