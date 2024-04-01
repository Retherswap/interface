import React, { useEffect, useState } from 'react';
import { apiUrl } from 'configs/server';
import { useActiveWeb3React } from 'hooks';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import styled from 'styled-components';
import { Balance as BalanceModel } from 'models/schema';
import Balance from 'pages/Balance/balance';

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

export default function TokenBalanceTransaction({
  match: {
    params: { tokenAddress },
  },
}: Readonly<RouteComponentProps<{ tokenAddress: string }>>) {
  const web3 = useActiveWeb3React();
  const [balance, setBalance] = useState<BalanceModel | undefined>(undefined);
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
  }, [web3.account, tokenAddress]);
  return (
    <Balance>
      <BackLink to={`/balance/${tokenAddress}/transactions`}>
        <ChevronLeft size={25}></ChevronLeft>
      </BackLink>
      <TokenBalanceContainer>Zaz</TokenBalanceContainer>
    </Balance>
  );
}
