import React, {FC, useContext, useEffect} from 'react';
import {ListGroup} from 'react-bootstrap';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import DownloadButton from '../DownloadButton/DownloadButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import {File} from '../../redux/storage/types';
import {useDeleteFileMutation} from '../../redux/storage/storage-api';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const FileItem: FC<{
  file: File;
  isActive: boolean;
  disabled: boolean;
}> = ({file, isActive, disabled}) => {
  const {activeFile, setActiveFile} = useContext(FileContext);
  const [deleteFile, {isLoading, isSuccess}] = useDeleteFileMutation();

  const {name, pathname} = file;
  const size = formatBytes(file.sizeInBytes);
  const date = new Date(file.createdAt).toLocaleString('en-GB');

  const activeStyle = {
    backgroundColor: '#e8f0fe'
  };

  const loadingStyle = {
    backgroundColor: '#b8b8b8',
    opacity: 0.5
  };

  useEffect(() => {
    if (isSuccess) {
      setActiveFile(null);
    }
  }, [isLoading, isSuccess]);

  const deleteHandler = () => {
    deleteFile({id: file._id});
  };

  return (
    <ListGroup.Item
      className={'d-flex justify-content-start align-items-center'}
      onClick={() => {
        !isActive && setActiveFile(file);
      }}
      style={{
        height: 50,
        cursor: 'pointer',
        ...(isActive && activeStyle),
        ...(isLoading && loadingStyle)
      }}
      disabled={disabled}
    >
      <span style={{width: 500}}>{name}</span>
      <span style={{width: 200}}>{date}</span>
      <span style={{width: 200}}>{size}</span>
      {isActive && (
        <div className="d-flex flex-grow-1 justify-content-end">
          <DownloadButton
            size={'sm'}
            className={'me-3'}
            disabled={isLoading}
            link={process.env.REACT_APP_STATIC_SERVER_URL + pathname.replace('/archives', '')}
          />
          <DeleteButton onClick={deleteHandler} size={'sm'} isLoading={isLoading} />
        </div>
      )}
    </ListGroup.Item>
  );
};

export default FileItem;
