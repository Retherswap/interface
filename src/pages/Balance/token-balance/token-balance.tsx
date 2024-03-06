import React, { useEffect, useState } from 'react';
import { useNativeToken } from 'hooks/useNativeToken';
import { useDefaultTokens } from 'hooks/Tokens';
import Balance from '../balance';
import { apiUrl } from 'configs/server';
import { useActiveWeb3React } from 'hooks';
import TokenBalanceHeader from './token-balance-header';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import styled, { useTheme } from 'styled-components';
import TokenBalancePrice from './token-balance-price';
import { ButtonPrimary } from 'components/Button';
import { Balance as BalanceModel } from 'models/schema';
import TokenBalanceProfit from './token-balance-profit';

const BackLink = styled(Link)`
  position: absolute;
  left: 12px;
  top: 12px;
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
  const [balance, setBalance] = useState<BalanceModel | undefined>(undefined);
  const theme = useTheme();
  useEffect(() => {
    const fetchInfo = () => {
      return fetch(`${apiUrl}/balances/address/${web3.account}/token/${tokenAddress}`)
        .then((res) => res.json())
        .then((d) => setBalance(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [web3.account]);
  return (
    <Balance>
      <BackLink to="/balance">
        <ChevronLeft color={theme.text3} size={30} strokeWidth={1}></ChevronLeft>
      </BackLink>
      <TokenBalanceContainer>
        <TokenBalanceHeader balance={balance}></TokenBalanceHeader>
        <TokenBalanceContent>
          <TokenBalancePrice balance={balance}></TokenBalancePrice>{' '}
          <TokenBalanceProfit balance={balance}></TokenBalanceProfit>
        </TokenBalanceContent>
      </TokenBalanceContainer>
    </Balance>
  );
}
