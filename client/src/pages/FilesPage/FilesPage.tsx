import React, {FC, useState, createContext, useMemo} from 'react';
import {Container} from 'react-bootstrap';
import FileList from '../../components/FileList/FileList';
import {Navigate} from 'react-router-dom';
import {useAppSelector} from '../../hooks';
import {File} from '../../redux/storage/types';
import {selectIsAuth} from '../../redux/auth/selectors';

interface FileContext {
  activeFile: File | null;
  setActiveFile: (file: File | null) => void;
}

export const FileContext = createContext<FileContext>({
  activeFile: null,
  setActiveFile: () => {}
});

const FilesPage: FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const [activeFile, setActiveFile] = useState<File | null>(null);

  if (!isAuth) {
    return <Navigate to={'/auth'} replace />;
  }

  return (
    <main>
      <Container>
        <section className={'pt-5'}>
          <FileContext.Provider value={{activeFile, setActiveFile}}>
            <FileList />
          </FileContext.Provider>
        </section>
      </Container>
    </main>
  );
};

export default FilesPage;
