import React, {FC} from 'react';
import {Button, Spinner} from 'react-bootstrap';

interface DeleteButtonProps {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  size?: 'sm' | 'lg';
}

const DeleteButton: FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
  className,
  isLoading,
  isSuccess,
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

  if (isSuccess) {
    content = (
      <div className="d-flex justify-content-center">
        <i className={'bi-check-lg mx-3'}></i>
      </div>
    );
  }

  if (!isLoading && !isSuccess) {
    content = (
      <div>
        Delete <i className={'bi-trash3'} />
      </div>
    );
  }

  return (
    <Button
      size={size}
      disabled={disabled || isLoading || isSuccess}
      variant="danger"
      onClick={onClick}
      className={className}
    >
      {content}
    </Button>
  );
};

export default DeleteButton;
