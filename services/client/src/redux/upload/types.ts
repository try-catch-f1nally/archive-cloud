export interface CreateArchiveBody {
  name: string;
  files: Array<Blob>;
  format: string;
  password?: string;
}

export type UploadingStatus = 'process' | 'success' | 'error';
