
import React, { useEffect, useState } from 'react';
import { STAKE1 } from '../../constants';
import { usePair, PairState } from '../../data/Reserves';
import { Text } from 'rebass';
import styled from 'styled-components';
import { ChainId, WETH } from '@retherswap/sdk';

export const RetherPrice = styled(Text)`
  width: 140px;
  margin: 0 auto;
  padding: 0.1rem;
  justify-content: left
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

const TokenA = WETH[ChainId.HYPRA];
const TokenB = STAKE1;

export const RetherPriceComponent: React.FC = () => {
  const [pairState, pair] = usePair(TokenA, TokenB);
  const [price, setPrice] = useState<string | null>(null);
  const [hypPriceValue, setHypPriceValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchHypPrice = async () => {
      try {
        const response = await fetch('https://explorer.hypra.network/api?module=stats&action=coinprice');
        const data = await response.json();
        const fetchedHypPrice = data.result.coin_usd;

        // Assuming 'coin_usd' is a numeric value, you may need to adjust this depending on the actual response structure
        setHypPriceValue(parseFloat(fetchedHypPrice));
      } catch (error) {
        console.error('Error fetching HYP price:', error);
        setHypPriceValue(null);
      }
    };

    fetchHypPrice();
  }, []);

  useEffect(() => {
    if (pairState === PairState.EXISTS && pair && hypPriceValue !== null) {
      const token1Price = pair.token1Price.toSignificant(6);
      const priceValue: number = parseFloat(token1Price) * hypPriceValue;
      const formattedPrice = priceValue.toFixed(5);
      setPrice(formattedPrice);
    } else {
      setPrice(null);
    }
  }, [pairState, pair, hypPriceValue]);
  

  if (pairState === PairState.LOADING || hypPriceValue === null) {
    return <p>Loading...</p>;
  }

  if (pairState === PairState.INVALID) {
    return <p>Invalid pair</p>;
  }

  if (pairState === PairState.NOT_EXISTS) {
    return <p>Pair does not exist</p>;
  }

  return (
    <RetherPrice>
      <>RETHER ${price}</>
    </RetherPrice>
  );
};