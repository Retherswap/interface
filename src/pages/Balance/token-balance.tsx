import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HideExtraSmall, TYPE } from 'theme';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { BalanceModel } from 'models/BalanceModel';
import { formatNumber } from 'utils/formatNumber';
import { useDefaultTokens } from 'hooks/Tokens';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { useWindowSize } from 'hooks/useWindowSize';

const TokenBalanceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  width: 100%;
  box-shadow: 0 0 10px skyblue;
  border-radius: 15px;
  background: ${({ theme }) => theme.bg1};
`;

export default function TokenBalance({ balance }: { balance: BalanceModel }) {
  const nativeToken = useNativeToken();
  const defaultTokens = useDefaultTokens();
  const usdBalance = balance.balance * Number(balance.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice);
  const size = useWindowSize();
  return (
    <TokenBalanceContainer>
      <Row style={{ gap: '10px' }}>
        <CurrencyLogo currency={defaultTokens[balance.token.address]} size="40px" />
        <TYPE.black fontSize={15}>{(size?.width ?? 0) < 500 ? balance.token.symbol : balance.token.name}</TYPE.black>
      </Row>
      <Column style={{ alignItems: 'end', textAlign: 'end', gap: '5px' }}>
        <TYPE.black fontWeight={800} fontSize={18}>
          $ {formatNumber(usdBalance, { reduce: (size?.width ?? 0) < 500 })}
        </TYPE.black>
        <TYPE.darkGray fontSize={13} style={{ textWrap: 'nowrap' }}>
          {formatNumber(balance.balance, { reduce: (size?.width ?? 0) < 500 })} {balance.token.symbol}
        </TYPE.darkGray>
      </Column>
    </TokenBalanceContainer>
  );
}
