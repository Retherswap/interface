import Row from 'components/Row';
import useTheme from 'hooks/useTheme';
import React from 'react';
import styled from 'styled-components';
import { TYPE } from 'theme';
import Column from 'components/Column';
import { formatNumber } from 'utils/formatNumber';
import { AppInfo } from 'models/schema';
import { transparentize } from 'polished';

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

export default function DexStatsSection({ appInfos }: { appInfos?: AppInfo }) {
  const totalVolume = appInfos?.totalVolume?.reduce((a, b) => a + b.usdVolume, 0);
  const theme = useTheme();
  return (
    <DexStatsSectionComponent>
      <Column style={{ textAlign: 'center', gap: '3em' }}>
        <div>
          <TYPE.black fontWeight={800} fontSize={35}>
            Get involved in the HYPRA future:
          </TYPE.black>
          <TYPE.black fontWeight={800} fontSize={35}>
            Retherswap is the entry point
          </TYPE.black>
        </div>
        <Row style={{ justifyContent: 'space-between' }}>
          <Column style={{ alignItems: 'center' }}>
            <TYPE.blue fontSize={20} fontWeight={800}>
              Total Users
            </TYPE.blue>
            <TYPE.blue2 fontSize={40} fontWeight={800}>
              {formatNumber(appInfos?.totalUsers, { decimals: 0, reduce: false })}
            </TYPE.blue2>
          </Column>
          <Column style={{ alignItems: 'center' }}>
            <TYPE.blue fontSize={20} fontWeight={800}>
              Total Transactions
            </TYPE.blue>
            <TYPE.blue2 fontSize={40} fontWeight={800}>
              {formatNumber(appInfos?.totalTransactions, { reduce: false })}
            </TYPE.blue2>
          </Column>
          <Column style={{ alignItems: 'center' }}>
            <TYPE.blue fontSize={20} fontWeight={800}>
              Total Volume
            </TYPE.blue>
            <TYPE.blue2 fontSize={40} fontWeight={800}>
              ${formatNumber(totalVolume, { reduce: false })}
            </TYPE.blue2>
          </Column>
        </Row>
      </Column>
      <svg style={{ position: 'absolute', bottom: 0 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1660 48">
        <path fill={theme.bg1} d="M1660 0C1139.02 1.8113 336.256 32.7547 0 48H1660V0Z"></path>
      </svg>
    </DexStatsSectionComponent>
  );
}
