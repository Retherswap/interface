import { useNativeToken } from 'hooks/useNativeToken';
import React, { useEffect, useState } from 'react';
import { Text } from 'rebass';
import styled from 'styled-components';

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
  const { nativeToken, loading, error } = useNativeToken();

  return (
    <HypPrice>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && <>HYP ${nativeToken?.usdPrice}</>}
    </HypPrice>
  );
};
