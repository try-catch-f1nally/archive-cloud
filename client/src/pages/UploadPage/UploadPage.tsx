import React, {FC, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import UploadProgress from '../../components/UploadProgress/UploadProgress';
import {Container, Button} from 'react-bootstrap';
import {useAppSelector} from '../../hooks';
import {selectIsAuth, selectToken} from '../../redux/auth/selectors';
import {Navigate} from 'react-router-dom';
import {useGetStatusQuery} from '../../redux/upload/upload-api';
const UploadPage: FC = () => {
  const navigate = useNavigate();
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(300);
  const [status, setStatus] = useState<string | undefined>();
  const isSuccess = status === 'success';

  // @ts-ignore
  const {data} = useGetStatusQuery('get-progress', {
    pollingInterval
  });

  useEffect(() => {
    setStatus(data?.status);
    if (data?.status === 'success' || data?.status === 'error') {
      setPollingInterval(undefined);
    }
  }, [data]);

  const accessToken = useAppSelector(selectToken);

  const isAuth = useAppSelector(selectIsAuth);
  if (!isAuth) {
    return <Navigate to={'/auth'} replace />;
  }

  return (
    <main>
      <Container>
        <div className={'p-5 mb-2'}>
          <UploadProgress animated={!isSuccess} />
        </div>
        <div className={'d-flex justify-content-center'}>
          <Button
            size={'lg'}
            disabled={!isSuccess}
            onClick={() => {
              navigate('/files');
            }}
            className={'px-4'}
          >
            To my files
          </Button>
        </div>
      </Container>
    </main>
  );
};
export default UploadPage;
