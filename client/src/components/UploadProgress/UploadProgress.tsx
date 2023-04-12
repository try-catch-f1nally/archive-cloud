import React, {FC} from 'react';
import {ProgressBar, Spinner} from 'react-bootstrap';

interface UploadProgressProps {
  animated: boolean;
}

const UploadProgress: FC<UploadProgressProps> = ({animated}) => {
  return (
    <div className={'d-flex flex-column align-items-center '}>
      <Spinner className={'mb-2'} />
      <h3>Uploading</h3>
    </div>
  );
};

export default UploadProgress;
