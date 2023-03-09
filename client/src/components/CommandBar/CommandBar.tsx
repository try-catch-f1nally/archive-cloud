import React, {FC, useContext} from 'react';
import {Card} from 'react-bootstrap';
import DeleteButton from '../DeleteButton/DeleteButton';
import DownloadButton from '../DownloadButton/DownloadButton';
import {File} from '../../redux/storage/types';
import {FileContext} from '../../pages/FilesPage/FilesPage';

const CommandBar: FC = () => {
  const {activeFile} = useContext(FileContext);
  const isSelected = activeFile != null;

  return (
    <Card body style={{boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)'}} className={'mb-2'}>
      <DownloadButton disabled={!isSelected} onClick={() => {}} className={'me-3'} />
      <DeleteButton disabled={!isSelected} onClick={() => {}} className={'me-3'} />
    </Card>
  );
};

export default CommandBar;
