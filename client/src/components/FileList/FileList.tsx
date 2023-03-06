import React, {FC, useContext} from 'react';
import {Container, Table} from 'react-bootstrap';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import FileItem from './FileItem';
import {File} from '../../pages/FilesPage/FilesPage';

const FileList: FC<{files: File[]}> = ({files}) => {
  const {activeFile} = useContext(FileContext);

  return (
    <Container>
      <Table hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>File size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <FileItem key={index} file={file} isActive={file.id === activeFile?.id} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FileList;
