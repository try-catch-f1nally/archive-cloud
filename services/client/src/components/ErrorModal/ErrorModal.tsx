import React, {FC} from 'react';
import {Button, Modal} from 'react-bootstrap';

interface ErrorModalProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

const ErrorModal: FC<ErrorModalProps> = ({message, show, onHide}) => {
  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Error message</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant={'danger'}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
