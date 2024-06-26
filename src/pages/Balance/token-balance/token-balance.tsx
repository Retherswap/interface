import React from 'react';
import Balance from '../balance';
import { useActiveWeb3React } from 'hooks';
import TokenBalanceHeader from './token-balance-header';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import styled from 'styled-components';
import TokenBalancePriceCard from './token-balance-price-card';
import TokenBalanceProfitCard from './token-balance-profit-card';
import { useTokenBalance } from 'apis/balance-api';
import TokenBalanceRewardCard from './token-balance-reward-card';

const BackLink = styled(Link)`
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 0.5em;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  &:hover {
    color: ${({ theme }) => theme.text2};
  }
`;

const TokenBalanceContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25em;
  padding: 0 1em;
  width: 100%;
`;

const TokenBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2em;
  padding-bottom: 0.5em;
`;

export default function TokenBalance({
  match: {
    params: { tokenAddress },
  },
}: Readonly<RouteComponentProps<{ tokenAddress: string }>>) {
  const web3 = useActiveWeb3React();
  const { balance } = useTokenBalance(web3.account ?? '', tokenAddress);
  return (
    <Balance>
      <BackLink to="/balance">
        <ChevronLeft size={25}></ChevronLeft>
      </BackLink>
      <TokenBalanceContainer>
        <TokenBalanceHeader balance={balance}></TokenBalanceHeader>
        <TokenBalanceContent>
          <TokenBalancePriceCard balance={balance}></TokenBalancePriceCard>
          <TokenBalanceProfitCard balance={balance}></TokenBalanceProfitCard>
          {(balance?.token?.rewards?.length ?? 0) > 0 && (
            <TokenBalanceRewardCard balance={balance}></TokenBalanceRewardCard>
          )}
        </TokenBalanceContent>
      </TokenBalanceContainer>
    </Balance>
  );
}
