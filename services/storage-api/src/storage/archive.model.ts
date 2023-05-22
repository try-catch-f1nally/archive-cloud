import {model, Schema} from 'mongoose';
import ArchiveModel, {ArchiveDocument} from './types/archive.model.interface';

const ArchiveSchema = new Schema<ArchiveDocument, ArchiveModel>({
  userId: {type: String, required: true, index: true},
  name: {type: String, required: true, unique: true, index: true},
  sizeInBytes: {type: Number, required: true},
  createdAt: {type: Date, default: new Date()},
  pathname: {type: String}
});

ArchiveSchema.pre<ArchiveDocument>('save', function (next) {
  this.pathname = `/archives/${this.userId}/${this.name}`;
  next();
});

export default model<ArchiveDocument, ArchiveModel>('Archive', ArchiveSchema);
