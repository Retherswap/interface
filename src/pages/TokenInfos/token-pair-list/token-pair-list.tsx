import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ThemeProvider, { TYPE, theme, colors } from 'theme';
import { useDefaultTokens } from 'hooks/Tokens';
import { TokenInfosCard } from '../token-infos-card';
import Column from 'components/Column';
import { PairModel } from 'models/PairModel';
import TokenPairRow from './token-pair-row/token-pair-row';
import { TokenPairListGrid } from './token-pair-list-grid';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { ButtonEmpty } from 'components/Button';
import useTheme from 'hooks/useTheme';
import Paginator from 'components/Paginator/Paginator';

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.bg3};
`;

export const RowDivider = styled(Divider)`
  height: 1px;
`;

export default function TokenPairList({ token }: { token: TokenModel }) {
  const elementsPerPage = 10;
  const [pairs, setPairs] = useState<PairModel[]>([]);
  const fetchInfo = () => {
    return fetch('http://162.0.211.141:4000/api/pairs/tokens/' + token.address)
      .then((res) => res.json())
      .then((d) => setPairs(d));
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const [page, setPage] = useState(1);
  return (
    <Column style={{ width: '100%' }}>
      <h1>Pairs</h1>
      <TokenInfosCard>
        <TokenPairListGrid>
          <TYPE.blue fontWeight={600}>#</TYPE.blue>
          <TYPE.blue fontWeight={600}>Pair</TYPE.blue>
          <TYPE.blue fontWeight={600}>TVL</TYPE.blue>
          <TYPE.blue fontWeight={600}>Volume 24H</TYPE.blue>
          <TYPE.blue fontWeight={600}>Volume 7D</TYPE.blue>
        </TokenPairListGrid>
        <Divider></Divider>
        {pairs.slice((page - 1) * elementsPerPage, page * elementsPerPage).map((pair, index) => (
          <Column key={`token-pair-row-${pair.id}`} style={{ gap: '1em' }}>
            <TokenPairRow
              index={(page - 1) * elementsPerPage + index + 1}
              token={token}
              pair={pair}
              key={pair.id}
            ></TokenPairRow>
            <RowDivider></RowDivider>
          </Column>
        ))}
        <Paginator
          page={page}
          elementsPerPage={elementsPerPage}
          count={pairs.length}
          onPageChange={(page) => {
            setPage(page);
          }}
        ></Paginator>
      </TokenInfosCard>
    </Column>
  );
}
