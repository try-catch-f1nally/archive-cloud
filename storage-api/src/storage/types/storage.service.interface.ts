import {ArchiveDocument} from "../../archive/types/archive.model.interface";

export interface StorageService {
  getUserArchives(userId: string): Promise<ArchiveDocument[]>;
  deleteArchive(_id: string, userId: string): Promise<void>;
  postArchive(userId: string, name: string): Promise<void>;
}
