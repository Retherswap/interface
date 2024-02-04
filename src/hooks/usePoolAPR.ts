import { JSBI, Token } from '@retherswap/sdk';
import { usePair } from 'data/Reserves';
import { useTotalSupply } from 'data/TotalSupply';
import { useMemo } from 'react';
import { useStakingInfo } from 'state/stake/hooks';

export default function usePoolAPR(tokenA: Token | undefined, tokenB: Token | undefined) {
  const [, stakingTokenPair] = usePair(tokenA, tokenB);
  const stakingInfo = useStakingInfo(stakingTokenPair)?.[0];
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token);
  return useMemo(() => {
    if (totalSupplyOfStakingToken && stakingInfo && stakingInfo.rewardsDuration && stakingTokenPair) {
      return (
        // Annual reward rate
        stakingInfo.totalRewardRate
          .multiply(JSBI.BigInt(365 * 24 * 60 * 60))
          // Get the total locked value of the LP token in terms of the token1 and divide the total annual reward by it to get the APR
          .divide(
            stakingTokenPair.getLiquidityValue(
              stakingTokenPair.token1,
              totalSupplyOfStakingToken,
              totalSupplyOfStakingToken,
              false
            )
          )
          // Divide by 2 to account for the fact that the LP token is a 50/50 pool of two assets
          .divide(JSBI.BigInt(2))
          // Convert to percentage
          .multiply(JSBI.BigInt(100))
          .toFixed(0)
      );
    }
    return '0';
  }, [stakingInfo, totalSupplyOfStakingToken, stakingTokenPair]);
}
