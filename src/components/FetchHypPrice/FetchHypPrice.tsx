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
  const [hypPrice, setHypPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHypPrice = async () => {
      try {
        const response = await fetch('https://explorer.hypra.network/api?module=stats&action=coinprice');
        const data = await response.json();

        // Assuming the response structure has a property like 'coin_usd'
        const hypPriceValue = data.result.coin_usd;
        setHypPrice(hypPriceValue);
      } catch (error) {
        console.error('Error fetching HYP price:', error);
        setError('Failed to fetch HYP price. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHypPrice();
  }, []);

  return (
    <HypPrice>
      {loading && <p>Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && <>HYP ${hypPrice}</>}
    </HypPrice>
  );
};