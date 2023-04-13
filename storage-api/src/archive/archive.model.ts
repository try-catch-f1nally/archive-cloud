import {model, Schema} from 'mongoose';
import ArchiveModel, {ArchiveDocument} from './types/archive.model.interface';

const ArchiveSchema = new Schema<ArchiveDocument, ArchiveModel>({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true, unique: true},
  sizeInBytes: {type: Number, required: true},
  createdAt: {type: Date, required: true},
  link: {type: String}
});

ArchiveSchema.pre('save', function (next) {
  this.link = `http://localhost:3003/archive/${this.userId}/download/${this.name}`;
  next();
})

export default model<ArchiveDocument, ArchiveModel>('Archive', ArchiveSchema);
