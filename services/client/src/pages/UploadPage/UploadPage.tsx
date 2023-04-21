import React, {FC, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import UploadProgress from '../../components/ArchiveProgress/ArchiveProgress';
import {Container, Button, Spinner} from 'react-bootstrap';
import {useAppSelector} from '../../hooks';
import {selectIsAuth, selectToken} from '../../redux/auth/selectors';
import {Navigate} from 'react-router-dom';
import {useGetStatusQuery} from '../../redux/upload/upload-api';
import {ArchivingStatus} from '../../redux/upload/types';

const UploadPage: FC = () => {
  const navigate = useNavigate();
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(300);
  const [status, setStatus] = useState<ArchivingStatus | undefined>();
  const isSuccessStatus = status === 'success';

  // @ts-ignore
  const {data, isLoading, isSuccess, isError} = useGetStatusQuery('get-status', {
    pollingInterval,
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    setStatus(data);
    if (data === 'success' || data === 'error') {
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
        {isLoading && (
          <div>
            <div className={'d-flex flex-column mt-4 align-items-center'}>
              <Spinner animation="grow" />
              <div className={'mt-2 fs-3'}>Trying get status...</div>
            </div>
          </div>
        )}
        {isError && (
          <div>
            <div className={'d-flex flex-column mt-4 align-items-center'}>
              <Spinner animation="grow" />
              <div className={'mt-2 fs-3'}>Error occurred while getting status</div>
            </div>
          </div>
        )}
        {isSuccess && (
          <div>
            <div className={'p-5 mb-2'}>
              <UploadProgress status={status} />
            </div>
            <div className={'d-flex justify-content-center'}>
              {status === 'error' ? (
                <Button
                  size={'lg'}
                  onClick={() => {
                    navigate('/upload');
                  }}
                  className={'px-4'}
                >
                  To upload page
                </Button>
              ) : (
                <Button
                  size={'lg'}
                  disabled={!isSuccessStatus}
                  onClick={() => {
                    navigate('/files');
                  }}
                  className={'px-4'}
                >
                  To my files
                </Button>
              )}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};
export default UploadPage;
