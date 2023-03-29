import React, {FC} from 'react';
import {Button} from 'react-bootstrap';

interface DeleteButtonProps {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: 'sm' | 'lg';
}

const DeleteButton: FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
  className,
  size = 'lg'
}) => {
  return (
    <Button
      size={size}
      disabled={disabled}
      variant="danger"
      onClick={onClick}
      className={className}
    >
      Delete <i className={'bi-trash3'} />
    </Button>
  );
};

export default DeleteButton;
