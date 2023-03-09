import React, {FC, useContext} from 'react';
import {Card, ListGroup} from 'react-bootstrap';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import FileItem from './FileItem';
import {File} from '../../redux/storage/types';
import {useGetFilesQuery} from '../../redux/storage/storage-api';

const FileList: FC = () => {
  const {data: files, isLoading, isFetching, isSuccess, isError, error} = useGetFilesQuery();
  const {activeFile} = useContext(FileContext);

  console.log(files);

  let content;

  if (isLoading || isFetching) {
    content = <div>Loading...</div>;
  }

  if (isSuccess && files) {
    content = (
      <Card>
        <Card.Header className={'d-flex justify-content-start align-items-center'}>
          <span style={{width: 500}}>Name</span>
          <span style={{width: 200}}>Date</span>
          <span style={{width: 200}}>File size</span>
        </Card.Header>
        <ListGroup variant="flush">
          {files?.map((file, index) => (
            <FileItem key={index} file={file} isActive={file.id === activeFile?.id} />
          ))}
        </ListGroup>
      </Card>
    );
  }

  console.log(files);
  return <>{content}</>;
};

export default FileList;
