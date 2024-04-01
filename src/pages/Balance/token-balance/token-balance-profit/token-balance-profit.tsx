import React, { useEffect, useMemo, useState } from 'react';
import { useActiveWeb3React } from 'hooks';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import styled from 'styled-components';
import Balance from 'pages/Balance/balance';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import { RowBetween } from 'components/Row';
import TokenBalanceProfitTab, { ProfitTab } from './token-balance-profit-tab/token-balance-profit-tab';
import { useTokenBalance } from 'apis/balance-api';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';

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

const TokenBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.5em;
  padding: 0.5em;
  margin-top: 2em;
`;

export default function TokenBalanceProfit({
  match: {
    params: { tokenAddress },
  },
}: Readonly<RouteComponentProps<{ tokenAddress: string }>>) {
  const web3 = useActiveWeb3React();
  const { balance } = useTokenBalance(web3.account ?? '', tokenAddress);
  const { nativeToken } = useNativeToken();
  const realizedProfit = useMemo(() => {
    if (balance && nativeToken) {
      return (
        Number(balance?.profit?.usdAmount ?? 0) -
        Number(balance?.spent?.usdAmount ?? 0) +
        Number(balance.balance) * Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice) -
        Number(balance?.profit?.buyPrice ?? 0)
      );
    }
    return undefined;
  }, [balance, nativeToken]);
  const nonRealizedProfit = useMemo(() => {
    if (balance && realizedProfit && nativeToken && balance.profit && balance.spent) {
      return (
        Number(balance.balance) * Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice) -
        Math.max(Number(balance.spent.usdAmount) - Number(balance?.profit?.usdAmount ?? 0), 0)
      );
    }
    return undefined;
  }, [balance, nativeToken, realizedProfit]);
  const totalProfit = useMemo(() => {
    if (nonRealizedProfit !== undefined && realizedProfit !== undefined) {
      return nonRealizedProfit + realizedProfit;
    }
    return undefined;
  }, [nonRealizedProfit, realizedProfit]);
  const [modes, setModes] = useState<ProfitTab[]>([]);
  const [selectedTab, setSelectedTab] = useState<ProfitTab | undefined>(undefined);
  useEffect(() => {
    const modes = [
      new ProfitTab(
        'Total',
        'Total profits/losses',
        'Realized profits/losses',
        `$${formatNumber(totalProfit, {
          reduce: false,
        })} USD`
      ),
      new ProfitTab(
        'Realized',
        'Realized profits/losses',
        'Realized profits/losses',
        `$${formatNumber(realizedProfit, {
          reduce: false,
        })} USD`
      ),
      new ProfitTab(
        'Non realized',
        'Non realized profits/losses',
        'Realized profits/losses',

        `$${formatNumber(nonRealizedProfit ?? '0', { reduce: false })} USD`
      ),
      new ProfitTab(
        'Spent',
        'Total spent',
        'Realized profits/losses',
        `$${formatNumber(balance?.spent?.usdAmount, { reduce: false })} USD`
      ),
    ];
    setModes(modes);
    setSelectedTab(modes[0]);
  }, [balance, setModes, setSelectedTab, nonRealizedProfit, realizedProfit, totalProfit]);
  return (
    <Balance>
      <BackLink to={`/balance/${tokenAddress}`}>
        <ChevronLeft size={25}></ChevronLeft>
      </BackLink>
      {selectedTab && (
        <TokenBalanceContainer>
          <Fonts.gray fontSize={16} fontWeight={500}>
            {selectedTab.title}
          </Fonts.gray>
          <Fonts.black fontSize={32} fontWeight={600}>
            {selectedTab.value}
          </Fonts.black>
          <Column style={{ width: '100%', gap: '5px' }}>
            <RowBetween>
              {modes.map((tab, index) => (
                <TokenBalanceProfitTab
                  key={index}
                  tab={tab}
                  active={tab.name === selectedTab.name}
                  onClick={() => {
                    setSelectedTab(tab);
                  }}
                />
              ))}
            </RowBetween>
            <Fonts.black fontSize={12} textAlign="center">
              {selectedTab.description}
            </Fonts.black>
          </Column>
        </TokenBalanceContainer>
      )}
    </Balance>
  );
}
