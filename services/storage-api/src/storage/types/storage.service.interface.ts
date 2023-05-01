import {Archive} from './archive.model.interface';

export interface StorageService {
  getUserArchives(userId: string): Promise<Archive[]>;
  deleteArchive(id: string): Promise<void>;
  updateArchive(id: string, name: string): Promise<void>;
  discoverArchive(userId: string, name: string): Promise<void>;
}
