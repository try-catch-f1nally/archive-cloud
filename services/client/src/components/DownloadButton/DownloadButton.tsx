import React, {FC} from 'react';
import {Button} from 'react-bootstrap';

interface DownloadButtonProps {
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  size?: 'sm' | 'lg';
  link: string;
}

const DownloadButton: FC<DownloadButtonProps> = ({
  disabled = false,
  className,
  size = 'lg',
  link
}) => {
  return (
    <Button size={size} disabled={disabled} className={className} href={link}>
      Download <i className={'bi-download'} />
    </Button>
  );
};

export default DownloadButton;
