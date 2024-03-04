import React, { useState } from 'react';

import Modal from '../Modal';
import { AutoColumn } from '../Column';
import styled from 'styled-components';
import { RowBetween } from '../Row';
import { Fonts } from '../../theme';
import { X } from 'react-feather';
import { ButtonPrimary } from '../Button';
import { useActiveWeb3React } from '../../hooks';
import AddressInputPanel from '../AddressInputPanel';
import { isAddress } from 'ethers/lib/utils';
import useENS from '../../hooks/useENS';
import { useDelegateCallback } from '../../state/governance/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { RETHER } from '../../constants';
import { LoadingView, SubmittedView } from '../ModalViews';

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`;

const StyledClosed = styled(X)`
  :hover {
    cursor: pointer;
  }
`;

const TextButton = styled.div`
  :hover {
    cursor: pointer;
  }
`;

interface VoteModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  title: string;
}

export default function DelegateModal({ isOpen, onDismiss, title }: VoteModalProps) {
  const { account, chainId } = useActiveWeb3React();

  // state for delegate input
  const [usingDelegate, setUsingDelegate] = useState(false);
  const [typed, setTyped] = useState('');
  function handleRecipientType(val: string) {
    setTyped(val);
  }

  // monitor for self delegation or input for third part delegate
  // default is self delegation
  const activeDelegate = usingDelegate ? typed : account;
  const { address: parsedAddress } = useENS(activeDelegate);

  // get the number of votes available to delegate
  const rethersBalance = useTokenBalance(account ?? undefined, chainId ? RETHER[chainId] : undefined);

  const delegateCallback = useDelegateCallback();

  // monitor call to help UI loading state
  const [hash, setHash] = useState<string | undefined>();
  const [attempting, setAttempting] = useState(false);

  // wrapper to reset state on modal close
  function wrappedOndismiss() {
    setHash(undefined);
    setAttempting(false);
    onDismiss();
  }

  async function onDelegate() {
    setAttempting(true);

    // if callback not returned properly ignore
    if (!delegateCallback) return;

    // try delegation and store hash
    const hash = await delegateCallback(parsedAddress ?? undefined)?.catch((error) => {
      setAttempting(false);
      console.log(error);
    });

    if (hash) {
      setHash(hash);
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <AutoColumn gap="lg" justify="center">
            <RowBetween>
              <Fonts.mediumHeader fontWeight={500}>{title}</Fonts.mediumHeader>
              <StyledClosed stroke="black" onClick={wrappedOndismiss} />
            </RowBetween>
            <Fonts.body>Earned RETHERS tokens represent voting shares in Retherswap governance.</Fonts.body>
            <Fonts.body>
              You can either vote on each proposal yourself or delegate your votes to a third party.
            </Fonts.body>
            {usingDelegate && <AddressInputPanel value={typed} onChange={handleRecipientType} />}
            <ButtonPrimary disabled={!isAddress(parsedAddress ?? '')} onClick={onDelegate}>
              <Fonts.mediumHeader color="white">
                {usingDelegate ? 'Delegate Votes' : 'Self Delegate'}
              </Fonts.mediumHeader>
            </ButtonPrimary>
            <TextButton onClick={() => setUsingDelegate(!usingDelegate)}>
              <Fonts.blue>
                {usingDelegate ? 'Remove' : 'Add'} Delegate {!usingDelegate && '+'}
              </Fonts.blue>
            </TextButton>
          </AutoColumn>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <Fonts.largeHeader>{usingDelegate ? 'Delegating votes' : 'Unlocking Votes'}</Fonts.largeHeader>
            <Fonts.main fontSize={36}>{rethersBalance?.toSignificant(4)}</Fonts.main>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <Fonts.largeHeader>Transaction Submitted</Fonts.largeHeader>
            <Fonts.main fontSize={36}>{rethersBalance?.toSignificant(4)}</Fonts.main>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  );
}
