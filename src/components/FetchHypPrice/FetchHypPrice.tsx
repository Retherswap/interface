import { useNativeToken } from 'hooks/useNativeToken';
import React from 'react';
import { Text } from 'rebass';
import styled from 'styled-components';
import { formatNumber } from 'utils/formatNumber';

export const HypPrice = styled(Text)`
  width: 125px;
  margin: 0 auto;
  padding: 0.1rem;
  justify-content: left;
  color: ${({ theme }) => theme.text1};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`;

export const PriceComponent = () => {
  const { nativeToken, error } = useNativeToken();

  return (
    <HypPrice>
      {!nativeToken && <p>Loading...</p>}
      {nativeToken && error && <p>{error}</p>}
      {nativeToken && !error && <>HYP ${formatNumber(nativeToken?.usdPrice, { decimals: 4 })}</>}
    </HypPrice>
  );
};
