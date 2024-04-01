import React from 'react';
import { AutoColumn } from '../../components/Column';
import styled from 'styled-components';
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks';
import PoolCard from '../../components/earn/PoolCard';
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

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`;

export default function Earn() {
  const { chainId } = useActiveWeb3React();

  // staking info for connected account
  const stakingInfos = useStakingInfo();

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0);

  return (
    <PageWrapper gap="lg" justify="center">
      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '550px' }}>
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
