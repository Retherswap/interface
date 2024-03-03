import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import AppBody from '../AppBody';
import BridgeHeader from 'components/Bridge/BridgeHeader';
import TokenListRow from './TokenListRow';
import { TokenModel } from 'models/TokenModel';
import { TokenListGrid } from './TokenListGrid';
import { TYPE } from 'theme';
import Column from 'components/Column';
import Paginator from 'components/Paginator/Paginator';
import { HideMedium } from 'components/Hide/hide-medium';
import { HideSmall } from 'components/Hide/hide-small';
import { HideExtraSmall } from 'components/Hide/hide-extra-small';

export const Wrapper = styled.div`
  display: grid;
  row-gap: 1em;
  position: relative;
  padding: 1.5rem;
  width: 100%;
  max-width: 1200px;
  border-radius: 2rem;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background: ${({ theme }) => theme.bg1};
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.bg3};
`;

export const RowDivider = styled(Divider)`
  height: 1px;
`;

export default function TokenList() {
  const elementsPerPage = 10;
  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const fetchInfo = () => {
    return fetch('http://162.0.211.141:4000/api/v1/tokens')
      .then((res) => res.json())
      .then((d) => setTokens(d));
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const [page, setPage] = useState(1);
  return (
    <div style={{ padding: '1em' }}>
      <SwapPoolTabs active={'swap'} />
      <Wrapper id="token-list-page">
        <TokenListGrid>
          <HideExtraSmall>
            <TYPE.blue fontWeight={600}>#</TYPE.blue>
          </HideExtraSmall>
          <TYPE.blue fontWeight={600}>Token</TYPE.blue>
          <TYPE.blue fontWeight={600}>Price</TYPE.blue>
          <HideMedium>
            <TYPE.blue fontWeight={600}>Price change</TYPE.blue>
          </HideMedium>
          <HideMedium>
            <TYPE.blue fontWeight={600}>Volume 24H</TYPE.blue>
          </HideMedium>
          <HideSmall>
            <TYPE.blue fontWeight={600}>TVL</TYPE.blue>
          </HideSmall>
        </TokenListGrid>
        <Divider />
        {tokens &&
          tokens.slice((page - 1) * elementsPerPage, page * elementsPerPage).map((token, index) => (
            <Column key={`token-row-${token.id}`} style={{ gap: '1em' }}>
              <TokenListRow index={index + 1} token={token} /> <RowDivider />
            </Column>
          ))}
        <Paginator
          page={page}
          elementsPerPage={elementsPerPage}
          count={tokens.length}
          onPageChange={(page) => {
            setPage(page);
          }}
        ></Paginator>
      </Wrapper>
    </div>
  );
}
