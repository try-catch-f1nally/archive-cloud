import React, {FC, useContext} from 'react';
import {FileContext} from '../../pages/FilesPage/FilesPage';
import {File} from '../../pages/FilesPage/FilesPage';

const FileItem: FC<{
  file: File;
  isActive: boolean;
}> = ({file, isActive}) => {
  const {activeFile, setActiveFile} = useContext(FileContext);
  const activeStyle = {
    backgroundColor: '#e8f0fe'
  };

  return (
    <tr
      onClick={() => {
        isActive ? setActiveFile(null) : setActiveFile(file);
      }}
      style={isActive ? activeStyle : {}}
    >
      <td>{file.name}</td>
      <td>{file.date}</td>
      <td>{file.size}</td>
    </tr>
  );
};

export default FileItem;
