import React, {FC, useContext} from 'react';
import {Card, ListGroup} from 'react-bootstrap';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import FileItem from './FileItem';
import {File} from '../../pages/FilesPage/FilesPage';

const FileList: FC<{files: File[]}> = ({files}) => {
  const {activeFile} = useContext(FileContext);

  return (
    <Card>
      <Card.Header className={'d-flex justify-content-start align-items-center'}>
        <span style={{width: 500}}>Name</span>
        <span style={{width: 200}}>Date</span>
        <span style={{width: 200}}>File size</span>
      </Card.Header>
      <ListGroup variant="flush">
        {files.map((file, index) => (
          <FileItem key={index} file={file} isActive={file.id === activeFile?.id} />
        ))}
      </ListGroup>
    </Card>
  );
};

export default FileList;
