import React, { useCallback, useMemo, useState } from 'react';
import Modal from '../Modal';
import { AutoColumn } from '../Column';
import styled from 'styled-components';
import { RowBetween } from '../Row';
import { Fonts, CloseIcon } from '../../theme';
import { ButtonError } from '../Button';
import { StakingInfo, useDerivedStakeInfo } from '../../state/stake/hooks';
import { useStakingContract } from '../../hooks/useContract';
import { SubmittedView, LoadingView } from '../ModalViews';
import { TransactionResponse } from '@ethersproject/providers';
import { useTransactionAdder } from '../../state/transactions/hooks';
import FormattedCurrencyAmount from '../FormattedCurrencyAmount';
import { useActiveWeb3React } from '../../hooks';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { maxAmountSpend } from 'utils/maxAmountSpend';
import { JSBI, Pair, TokenAmount } from '@retherswap/sdk';

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`;

const EarnedAmountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
  padding-left: 20px;
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
    if (stakingContract && stakingInfo?.stakedAmount && parsedAmount) {
      setAttempting(true);
      if (parsedAmount.equalTo(stakingInfo.stakedAmount)) {
        await stakingContract
          .exit({ gasLimit: 300000 })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Exiting farming position`,
            });
            setHash(response.hash);
          })
          .catch((error: any) => {
            setAttempting(false);
            console.log(error);
          });
      } else {
        await stakingContract
          .withdraw(`0x${parsedAmount.raw.toString(16)}`, { gasLimit: 300000 })
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
  }
  const [typedValue, setTypedValue] = useState('');
  const { parsedAmount } = useDerivedStakeInfo(typedValue, stakingInfo.stakedAmount.token, stakingInfo.stakedAmount);
  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue);
  }, []);
  const maxAmountInput = maxAmountSpend(stakingInfo.stakedAmount);
  const atMaxAmount = useMemo(() => Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput)), [
    maxAmountInput,
    parsedAmount,
  ]);
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);
  let error: string | undefined;
  if (!account) {
    error = 'Connect Wallet';
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter an amount';
  }
  const dummyPair = useMemo(
    () => new Pair(new TokenAmount(stakingInfo.tokens[0], '0'), new TokenAmount(stakingInfo.tokens[1], '0')),
    [stakingInfo]
  );
  const exiting = useMemo(() => parsedAmount?.equalTo(stakingInfo.stakedAmount), [
    parsedAmount,
    stakingInfo.stakedAmount,
  ]);

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <Fonts.mediumHeader>Withdraw</Fonts.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            customBalance={stakingInfo.stakedAmount}
            currency={stakingInfo.stakedAmount.token}
            pair={dummyPair}
            label={''}
            disableCurrencySelect={true}
            customBalanceText={'Available to withdraw: '}
            id="stake-liquidity-token"
          />
          {stakingInfo?.earnedAmount && (
            <EarnedAmountContainer>
              <div>
                <Fonts.black fontWeight={600}>Unclaimed {stakingInfo?.rewardToken.symbol}</Fonts.black>
              </div>
              <Fonts.black>{<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}</Fonts.black>
            </EarnedAmountContainer>
          )}
          {exiting && (
            <Fonts.subHeader style={{ textAlign: 'center' }}>
              When you exit, your {stakingInfo?.rewardToken.symbol} is claimed and your liquidity is removed from the
              mining pool.
            </Fonts.subHeader>
          )}
          <ButtonError
            disabled={!!error || !parsedAmount?.greaterThan(JSBI.BigInt(0))}
            error={!!error && !!stakingInfo?.stakedAmount}
            onClick={onWithdraw}
          >
            {error ?? parsedAmount?.equalTo(stakingInfo.stakedAmount) ? 'Exit & Claim' : 'Withdraw'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <Fonts.body fontSize={20}>
              Withdrawing {parsedAmount?.toSignificant(4)} {stakingInfo.tokens[0].symbol}-{stakingInfo.tokens[1].symbol}{' '}
              LP
            </Fonts.body>
            {exiting && (
              <Fonts.body fontSize={20}>
                Claiming {stakingInfo?.earnedAmount?.toSignificant(4)} {stakingInfo?.rewardToken.symbol}
              </Fonts.body>
            )}
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
            {exiting && <Fonts.body fontSize={20}>Claimed {stakingInfo?.rewardToken.symbol}!</Fonts.body>}
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  );
}
