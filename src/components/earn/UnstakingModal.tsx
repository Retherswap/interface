import React, { useState } from 'react';
import Modal from '../Modal';
import { AutoColumn } from '../Column';
import styled from 'styled-components';
import { RowBetween } from '../Row';
import { Fonts, CloseIcon } from '../../theme';
import { ButtonError } from '../Button';
import { StakingInfo } from '../../state/stake/hooks';
import { useStakingContract } from '../../hooks/useContract';
import { SubmittedView, LoadingView } from '../ModalViews';
import { TransactionResponse } from '@ethersproject/providers';
import { useTransactionAdder } from '../../state/transactions/hooks';
import FormattedCurrencyAmount from '../FormattedCurrencyAmount';
import { useActiveWeb3React } from '../../hooks';

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`;

interface StakingModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  stakingInfo: StakingInfo;
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React();

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder();
  const [hash, setHash] = useState<string | undefined>();
  const [attempting, setAttempting] = useState(false);

  function wrappedOndismiss() {
    setHash(undefined);
    setAttempting(false);
    onDismiss();
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress);

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true);
      await stakingContract
        .exit({ gasLimit: 300000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`,
          });
          setHash(response.hash);
        })
        .catch((error: any) => {
          setAttempting(false);
          console.log(error);
        });
    }
  }

  let error: string | undefined;
  if (!account) {
    error = 'Connect Wallet';
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter an amount';
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <Fonts.mediumHeader>Withdraw</Fonts.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <Fonts.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </Fonts.body>
              <Fonts.body>Deposited liquidity:</Fonts.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <Fonts.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </Fonts.body>
              <Fonts.body>Unclaimed {stakingInfo?.rewardToken.symbol}</Fonts.body>
            </AutoColumn>
          )}
          <Fonts.subHeader style={{ textAlign: 'center' }}>
            When you withdraw, your {stakingInfo?.rewardToken.symbol} is claimed and your liquidity is removed from the
            mining pool.
          </Fonts.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? 'Withdraw & Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <Fonts.body fontSize={20}>
              Withdrawing {stakingInfo?.stakedAmount?.toSignificant(4)} {stakingInfo.tokens[0].symbol}-
              {stakingInfo.tokens[1].symbol} LP
            </Fonts.body>
            <Fonts.body fontSize={20}>
              Claiming {stakingInfo?.earnedAmount?.toSignificant(4)} {stakingInfo?.rewardToken.symbol}
            </Fonts.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <Fonts.largeHeader>Transaction Submitted</Fonts.largeHeader>
            <Fonts.body fontSize={20}>
              Withdrew {stakingInfo.tokens[0].symbol}-{stakingInfo.tokens[1].symbol} LP!
            </Fonts.body>
            <Fonts.body fontSize={20}>Claimed {stakingInfo?.rewardToken.symbol}!</Fonts.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  );
}
