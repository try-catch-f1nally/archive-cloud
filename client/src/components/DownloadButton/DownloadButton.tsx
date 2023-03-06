import React, {FC} from 'react';
import {Button} from 'react-bootstrap';

interface DownloadButtonProps {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const DownloadButton: FC<DownloadButtonProps> = ({onClick, disabled = false, className}) => {
  return (
    <Button size={'lg'} disabled={disabled} onClick={onClick} className={className}>
      Download <i className={'bi-download'} />
    </Button>
  );
};

export default DownloadButton;
