import React, {FC, useState, createContext} from 'react';
import {Container} from 'react-bootstrap';
import FileList from '../../components/FileList/FileList';
import {Navigate} from 'react-router-dom';
import {useAppSelector} from '../../hooks';
import {selectIsAuth} from '../../redux/auth/selectors';
import CommandBar from '../../components/CommandBar/CommandBar';

interface FileContext {
  activeFile: File | null;
  setActiveFile: (file: File | null) => void;
}

export const FileContext = createContext<FileContext>({
  activeFile: null,
  setActiveFile: () => {}
});

export interface File {
  id: string;
  name: string;
  date: string;
  size: string;
  link: string;
}

const FilesPage: FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const [activeFile, setActiveFile] = useState<File | null>(null);

  if (!isAuth) {
    return <Navigate to={'/auth'} replace />;
  }

  // id, name, date, size, link

  const files = [
    {
      id: '1',
      name: 'file1',
      date: '2021-01-01',
      size: '43.5 MB',
      link: 'https://www.google.com'
    },
    {
      id: '2',
      name: 'file2',
      date: '2021-01-02',
      size: '29.5 MB',
      link: 'https://www.google.com'
    },
    {
      id: '3',
      name: 'file3',
      date: '2021-01-03',
      size: '32.3 MB',
      link: 'https://www.google.com'
    },
    {
      id: '4',
      name: 'file4',
      date: '2021-01-04',
      size: '95 MB',
      link: 'https://www.google.com'
    }
  ] as File[];

  return (
    <main>
      <Container>
        <section className={'pt-5'}>
          <FileContext.Provider value={{activeFile, setActiveFile}}>
            <CommandBar />
            <FileList files={files} />
          </FileContext.Provider>
        </section>
      </Container>
    </main>
  );
};

export default FilesPage;
