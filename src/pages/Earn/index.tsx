import React from 'react';
import { AutoColumn } from '../../components/Column';
import styled from 'styled-components';
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks';
import { Fonts } from '../../theme';
import PoolCard from '../../components/earn/PoolCard';
import { RowBetween } from '../../components/Row';
import { CardSection, DataCard, CardNoise } from '../../components/earn/styled';
import { Countdown } from './Countdown';
import Loader from '../../components/Loader';
import { useActiveWeb3React } from '../../hooks';
import { OutlineCard } from '../../components/Card';

const PageWrapper = styled(AutoColumn)`
  position: relative;
  max-width: 550px;
  padding: 0.5em;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
    max-width: 400px;
  `}
`;

const TopSection = styled(AutoColumn)`
  max-width: 550px;
  width: 100%;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.blue2};
`;

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`;

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`;

export default function Earn() {
  const { chainId } = useActiveWeb3React();

  // staking info for connected account
  const stakingInfos = useStakingInfo();

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0);

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <Fonts.white fontWeight={600}>Retherswap liquidity staking</Fonts.white>
              </RowBetween>
              <RowBetween>
                <Fonts.white fontSize={14}>
                  Deposit your Liquidity Provider tokens to receive RETHER, Retherswap protocol governance token
                </Fonts.white>
              </RowBetween>{' '}
            </AutoColumn>
          </CardSection>
          <CardNoise />
        </DataCard>
      </TopSection>
      <AutoColumn gap="lg" style={{ width: '92.5%', maxWidth: '550px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <Fonts.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</Fonts.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : (
            stakingInfos?.map((stakingInfo) => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />;
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  );
}
