import {Document, Model} from 'mongoose';

export interface Archive {
  userId: string;
  name: string;
  sizeInBytes: number;
  createdAt: Date;
  pathname: string;
}

export interface ArchiveDocument extends Archive, Document {}

type ArchiveModel = Model<ArchiveDocument>;
export default ArchiveModel;
