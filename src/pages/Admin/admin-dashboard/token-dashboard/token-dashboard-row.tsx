import React from 'react';
import CurrencyLogo from 'components/CurrencyLogo';
import { useCurrency } from 'hooks/useCurrency';
import { Token } from 'models/schema';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Fonts } from 'theme';

const TokenDashboardRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  align-items: center;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;

  :hover {
    opacity: 0.7;
    text-decoration: none;
  }

  :focus {
    outline: none;
    text-decoration: none;
  }

  :active {
    text-decoration: none;
  }
`;

export default function AdminTokenDashboardRow({ token }: { token: Token }) {
  const currencyLogo = useCurrency(token.address.address);
  return (
    <StyledLink to={`/admin/token/${token.address.address}`}>
      <TokenDashboardRowContainer>
        <CurrencyLogo currency={currencyLogo} size="30px"></CurrencyLogo>
        <Fonts.black>{token.name}</Fonts.black>
      </TokenDashboardRowContainer>
    </StyledLink>
  );
}
