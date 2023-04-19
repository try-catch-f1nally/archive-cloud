import React, {FC} from 'react';
import {Button} from 'react-bootstrap';

interface DownloadButtonProps {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  isLoading?: boolean;
  size?: 'sm' | 'lg';
}

const DownloadButton: FC<DownloadButtonProps> = ({
  onClick,
  disabled = false,
  className,
  size = 'lg'
}) => {
  return (
    <Button size={size} disabled={disabled} onClick={onClick} className={className}>
      Download <i className={'bi-download'} />
    </Button>
  );
};

export default DownloadButton;
