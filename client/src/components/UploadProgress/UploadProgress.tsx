import React, {FC} from 'react';
import {ProgressBar} from 'react-bootstrap';

interface UploadProgressProps {
  animated: boolean;
  percentage: number;
}

const UploadProgress: FC<UploadProgressProps> = ({percentage, animated}) => {
  return (
    <div>
      <h3>Uploading {percentage}%</h3>
      <ProgressBar striped={animated} animated={animated} now={percentage} />
    </div>
  );
};

export default UploadProgress;
