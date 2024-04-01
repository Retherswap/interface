import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TokenListRow from './token-list-row';
import { TokenListGrid } from './token-list-grid';
import { Fonts } from 'theme';
import Column from 'components/Column';
import Paginator from 'components/Paginator/Paginator';
import { HideMedium } from 'components/Hide/hide-medium';
import { HideSmall } from 'components/Hide/hide-small';
import { apiUrl } from 'configs/server';
import { Token } from 'models/schema';
import Row from 'components/Row';
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
  const [tokens, setTokens] = useState<Token[]>([]);
  const fetchInfo = () => {
    return fetch(`${apiUrl}/tokens/listed_tokens`)
      .then((res) => res.json())
      .then((d) => setTokens(d))
      .catch((e) => {
        console.error(e);
      });
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const [page, setPage] = useState(1);
  return (
    <Row style={{ padding: '1em', width: '100%', justifyContent: 'center' }}>
      <Wrapper id="token-list-page" style={{ borderRadius: '1.5em' }}>
        <TokenListGrid>
          <HideExtraSmall>
            <Fonts.blue fontWeight={600} fontSize={16}>
              #
            </Fonts.blue>
          </HideExtraSmall>
          <Fonts.blue fontWeight={600} fontSize={16}>
            Token
          </Fonts.blue>
          <Fonts.blue fontWeight={600} fontSize={16}>
            Price
          </Fonts.blue>
          <Fonts.blue fontWeight={600} fontSize={16}>
            Change
          </Fonts.blue>
          <HideMedium>
            <Fonts.blue fontWeight={600} fontSize={16}>
              Volume 24H
            </Fonts.blue>
          </HideMedium>
          <HideSmall>
            <Fonts.blue fontWeight={600} fontSize={16}>
              Market cap
            </Fonts.blue>
          </HideSmall>
        </TokenListGrid>
        <Divider />
        {tokens.length > 0
          ? tokens.slice((page - 1) * elementsPerPage, page * elementsPerPage).map((token, index) => (
              <Column key={`token-row-${token.id}`} style={{ gap: '1em' }}>
                <TokenListRow index={(page - 1) * elementsPerPage + index + 1} token={token} />
                <RowDivider />
              </Column>
            ))
          : Array.from({ length: 10 }).map((_, index) => (
              <Column key={`skeleton-token-row-${index}`} style={{ gap: '1em' }}>
                <TokenListRow index={index + 1}></TokenListRow>
                <RowDivider />
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
    </Row>
  );
}
