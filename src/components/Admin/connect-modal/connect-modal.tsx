import { ButtonPrimary } from 'components/Button';
import Column from 'components/Column';
import Modal from 'components/Modal';
import { apiUrl } from 'configs/server';
import { useActiveWeb3React } from 'hooks/web3';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'state';
import { setIsAdmin, setLoginToken, setRequestConnection } from 'state/application/actions';
import { Fonts } from 'theme';

export default function AdminConnectModal() {
  const requestConnection = useSelector((state: AppState) => state.application.requestConnection);
  const isAdmin = useSelector((state: AppState) => state.application.isAdmin);
  const loginToken = useSelector((state: AppState) => state.application.loginToken);
  const web3 = useActiveWeb3React();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!web3.account) {
      return;
    }
    const fetchInfo = () => {
      return fetch(`${apiUrl}/addresses/is_admin/${web3.account}`)
        .then((res) => res.json())
        .then((data) => dispatch(setIsAdmin(data as boolean)))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [web3, dispatch]);
  const connect = useCallback(async () => {
    const token = 'retherswap-token-' + new Date().getTime();
    web3.library
      ?.getSigner()
      .signMessage(token)
      .then((signature) => {
        dispatch(setLoginToken(web3.account + ';' + token + ';' + signature));
      });
  }, [web3, dispatch]);
  useEffect(() => {
    if (isAdmin && loginToken) {
      dispatch(setRequestConnection(false));
    }
  }, [loginToken, dispatch, isAdmin]);
  return (
    <Modal isOpen={requestConnection} onDismiss={() => dispatch(setRequestConnection(false))}>
      <Column style={{ alignItems: 'center', gap: '1.5em', padding: '1.5em' }}>
        <Fonts.red>You should be connected to access this page</Fonts.red>
        <ButtonPrimary style={{ height: '40px' }} onClick={connect}>
          Connect
        </ButtonPrimary>
      </Column>
    </Modal>
  );
}
