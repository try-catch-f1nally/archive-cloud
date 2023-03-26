import {model, Schema} from 'mongoose';
import ArchiveModel, {ArchiveDocument} from './types/archive.model.interface';

const ArchiveSchema = new Schema<ArchiveDocument, ArchiveModel>({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true, unique: true},
  sizeInBytes: {type: Number, required: true},
  createdAt: {type: Date, required: true}
});

export default model<ArchiveDocument, ArchiveModel>('Archive', ArchiveSchema);
