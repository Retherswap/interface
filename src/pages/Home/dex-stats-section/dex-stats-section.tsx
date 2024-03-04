import Row from 'components/Row';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import Column from 'components/Column';
import { formatNumber } from 'utils/formatNumber';
import { AppInfo, PairTransaction } from 'models/schema';
import { transparentize } from 'polished';
import Marquee from 'react-fast-marquee';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { useDefaultTokens } from 'hooks/Tokens';
import { HideSmall } from 'components/Hide/hide-small';
import { apiUrl } from 'configs/server';
const DexStatsSectionComponent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 5vh;
  padding-bottom: 20vh;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.bg1} 0%,
    ${({ theme }) => theme.bg1} 15%,
    ${({ theme }) => transparentize(0.95, theme.primary1)} 65%,
    ${({ theme }) => transparentize(0.9, theme.primary1)} 95%
  );
`;

const TransactionContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 1em;
  width: 100%;
  margin-left: 1em;
`;

const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.75em 1.25em;
  border-radius: 1.5em;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

const Title = styled(Fonts.black)`
  font-size: 35px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 30px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 25px;  
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall` 
  font-size: 18px;
`};
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  gap: 2em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  gap: 1em;
  align-items: center;
`};
`;

const MarqueeContainer = styled(Marquee)``;

export default function DexStatsSection({ appInfos }: { appInfos?: AppInfo }) {
  const [transactions, setTransactions] = useState<PairTransaction[]>([]);
  useEffect(() => {
    const fetchRetherInfo = () => {
      return fetch(`${apiUrl}/pair_transactions/latest`)
        .then((res) => res.json())
        .then((d) => setTransactions(d));
    };
    fetchRetherInfo();
  }, []);
  const totalTVL = appInfos?.totalTvl?.[0].reserveUsd;
  const defaultTokens = useDefaultTokens();
  return (
    <DexStatsSectionComponent>
      <Column style={{ textAlign: 'center', alignItems: 'center', gap: '3em' }}>
        <div>
          <Title>Get involved in the HYPRA's future:</Title>
          <Title>Retherswap is the entry point</Title>
        </div>
        <StatsContainer>
          <Column style={{ alignItems: 'center' }}>
            <Fonts.blue fontSize={20} fontWeight={800}>
              Total Users
            </Fonts.blue>
            <Fonts.blue2 fontSize={40} fontWeight={800}>
              {formatNumber(appInfos?.totalUsers, { decimals: 0, reduce: false })}
            </Fonts.blue2>
          </Column>
          <Column style={{ alignItems: 'center' }}>
            <Fonts.blue fontSize={20} fontWeight={800}>
              Total Transactions
            </Fonts.blue>
            <Fonts.blue2 fontSize={40} fontWeight={800}>
              {formatNumber(appInfos?.totalTransactions, { reduce: false })}
            </Fonts.blue2>
          </Column>
          <Column style={{ alignItems: 'center' }}>
            <Fonts.blue fontSize={20} fontWeight={800}>
              Total Value Locked
            </Fonts.blue>
            <Fonts.blue2 fontSize={40} fontWeight={800}>
              ${formatNumber(totalTVL, { reduce: false })}
            </Fonts.blue2>
          </Column>
        </StatsContainer>
        <MarqueeContainer style={{ maxWidth: '1000px', padding: '8px' }}>
          <TransactionContainer>
            {transactions.map((transaction, index) => (
              <TransactionRow key={`marquee-transaction-${transaction.id}`}>
                <DoubleCurrencyLogo
                  currency0={defaultTokens[transaction.inputToken.address]}
                  currency1={defaultTokens[transaction.outputToken.address]}
                  size={35}
                />
                <Fonts.black fontSize={18}>
                  <Row style={{ gap: '5px' }}>
                    <HideSmall>
                      {transaction.inputToken.symbol}/{transaction.outputToken.symbol} :
                    </HideSmall>
                    $
                    {formatNumber(Number(transaction.inputTokenUsdQuote) * Number(transaction.inputAmount), {
                      reduce: false,
                    })}
                  </Row>
                </Fonts.black>
              </TransactionRow>
            ))}
          </TransactionContainer>
        </MarqueeContainer>
      </Column>
      {/*<svg style={{ position: 'absolute', bottom: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1660 48">
        <path fill={theme.bg1} d="M1660 0C1139.02 1.8113 336.256 32.7547 0 48H1660V0Z"></path>
                  </svg>*/}
    </DexStatsSectionComponent>
  );
}
