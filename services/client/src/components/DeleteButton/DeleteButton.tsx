import React, {FC} from 'react';
import {Button, Spinner} from 'react-bootstrap';

interface DeleteButtonProps {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  isLoading?: boolean;
  size?: 'sm' | 'lg';
}

const DeleteButton: FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
  className,
  isLoading,
  size = 'lg'
}) => {
  let content;

  if (isLoading) {
    content = (
      <div className="d-flex justify-content-center">
        <Spinner size="sm" className="mx-3" />
      </div>
    );
  }

  if (!isLoading) {
    content = (
      <div>
        Delete <i className={'bi-trash3'} />
      </div>
    );
  }

  return (
    <Button
      size={size}
      disabled={disabled || isLoading}
      variant="danger"
      onClick={onClick}
      className={className}
    >
      {content}
    </Button>
  );
};

export default DeleteButton;
