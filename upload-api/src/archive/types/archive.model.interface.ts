import {Model, Schema, Document} from 'mongoose';

export interface Archive {
  userId: Schema.Types.ObjectId;
  name: string;
  sizeInBytes: number;
  createdAt: Date;
}

export interface ArchiveDocument extends Archive, Document {}

type ArchiveModel = Model<ArchiveDocument>;
export default ArchiveModel;
