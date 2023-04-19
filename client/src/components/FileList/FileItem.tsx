import React, {FC, useContext} from 'react';
import {ListGroup} from 'react-bootstrap';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import DownloadButton from '../DownloadButton/DownloadButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import {File} from '../../redux/storage/types';
import {useDeleteFileMutation} from '../../redux/storage/storage-api';

const FileItem: FC<{
  file: File;
  isActive: boolean;
}> = ({file, isActive}) => {
  const {activeFile, setActiveFile} = useContext(FileContext);
  const activeStyle = {
    backgroundColor: '#e8f0fe'
  };
  const [deleteFile] = useDeleteFileMutation();

  const deleteHandler = () => {
    deleteFile({id: file._id});
  };

  return (
    <ListGroup.Item
      className={'d-flex justify-content-start align-items-center'}
      action
      onClick={() => {
        isActive ? setActiveFile(null) : setActiveFile(file);
      }}
      style={{height: 50, backgroundColor: isActive ? '#e8f0fe' : 'white'}}
    >
      <span style={{width: 500}}>{file.name}</span>
      <span style={{width: 200}}>{file.createdAt}</span>
      <span style={{width: 200}}>{file.sizeInBytes}</span>
      {isActive && (
        <div className="d-flex flex-grow-1 justify-content-end">
          <DownloadButton
            onClick={() => {
              window.location.href = file.pathname;
            }}
            size={'sm'}
            className={'me-3'}
          />
          <DeleteButton onClick={deleteHandler} size={'sm'} />
        </div>
      )}
    </ListGroup.Item>
  );
};

export default FileItem;
