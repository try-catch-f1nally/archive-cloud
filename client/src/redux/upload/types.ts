export type ArchiveState = UploadingStatus;

export interface CreateArchiveBody {
  name: string;
  files: Array<Blob>;
  format: string;
  password?: string;
}

export interface UploadingStatus {
  status: 'process' | 'success' | 'error';
}
