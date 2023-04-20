import React, {FC, useContext, useEffect} from 'react';
import {Card, ListGroup, Spinner, Alert, Container} from 'react-bootstrap';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import FileItem from './FileItem';
import {File} from '../../redux/storage/types';
import {useGetFilesQuery} from '../../redux/storage/storage-api';

const FileList: FC = () => {
  const {activeFile, setActiveFile} = useContext(FileContext);

  const {
    data: files,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error
    // @ts-ignore
  } = useGetFilesQuery('get-files', {refetchOnMountOrArgChange: true, refetchOnWindowFocus: true});

  console.log('isLoading:' + isLoading + ' isFetching:' + isFetching + ' isSuccess:' + isSuccess);

  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (isSuccess && files.length >= 1) {
    content = (
      <Card>
        <Card.Header
          onClick={() => setActiveFile(null)}
          className={'d-flex justify-content-start align-items-center'}
        >
          <span style={{width: 500}}>Name</span>
          <span style={{width: 200}}>Date</span>
          <span style={{width: 200}}>File size</span>
        </Card.Header>
        <div style={{opacity: isFetching ? 0.5 : 1}}>
          {isFetching && (
            <Spinner
              style={{
                position: 'absolute',
                overflow: 'show',
                margin: 'auto',
                zIndex: 999,
                top: '50%',
                left: '50%'
              }}
              variant="primary"
            />
          )}
          <ListGroup variant="flush">
            {files?.map((file, index) => (
              <FileItem
                key={index}
                file={file}
                isActive={file._id === activeFile?._id}
                disabled={isFetching ? true : false}
              />
            ))}
          </ListGroup>
        </div>
      </Card>
    );
  }

  if (isSuccess && files.length === 0) {
    content = (
      <Container className="d-flex fs-4 justify-content-center">
        <Alert variant="warning" className="px-5">
          <i className="bi bi-exclamation-circle me-2"></i>
          No files found
        </Alert>
      </Container>
    );
  }

  if (isError) {
    content = (
      <Container className="d-flex fs-4 justify-content-center">
        <Alert variant="danger" className="px-5">
          <i className="bi bi-exclamation-circle me-2"></i>
          Error occurred while getting files
        </Alert>
      </Container>
    );
  }

  return <>{content}</>;
};

export default FileList;
