export const SUPPORTED_ARCHIVE_FORMATS = ['zip', '7z', 'wim', 'tar', 'tar.gz', 'tar.xz', 'tar.bz2'] as const;

export type SupportedArchiveFormats = (typeof SUPPORTED_ARCHIVE_FORMATS)[number];

export type UploadOptions = {
  name: string;
  format: SupportedArchiveFormats;
  password?: string;
};

export type UploadingProgress = StatusProcess | StatusSuccess | StatusError;
export type UploadingStatus = UploadingProgress['status'];

type StatusProcess = {
  status: 'process';
  percentage: number;
};

type StatusError = {
  status: 'error';
  errorMessage: string;
};

type StatusSuccess = {
  status: 'success';
};
