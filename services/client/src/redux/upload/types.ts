export interface CreateArchiveBody {
  name: string;
  files: Array<Blob>;
  format: string;
  password?: string;
}

export type ArchivingStatus = 'process' | 'success' | 'error';
