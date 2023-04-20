import React, {FC} from 'react';
import {ProgressBar, Spinner} from 'react-bootstrap';
import {UploadingStatus} from '../../redux/upload/types';

interface UploadProgressProps {
  status: UploadingStatus | undefined;
}

const UploadProgress: FC<UploadProgressProps> = ({status}) => {
  let content;
  if (status === 'process') {
    content = (
      <div className={'d-flex flex-column align-items-center '}>
        <Spinner className={'mb-2'} />
        <h3>Uploading</h3>
      </div>
    );
  }

  if (status === 'error') {
    content = (
      <div className={'d-flex flex-column align-items-center '}>
        <i className="bi bi-x-circle fs-1"></i>
        <h3>Error occurred while uploading file. Try again</h3>
      </div>
    );
  }

  if (status === 'success') {
    content = (
      <div className={'d-flex flex-column align-items-center '}>
        <i className="bi bi-check fs-1"></i>
        <h3>Uploaded</h3>
      </div>
    );
  }

  return <> {content}</>;
};

export default UploadProgress;
