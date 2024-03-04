import React, { useEffect, useState } from 'react';
import { Text } from 'rebass';
import styled from 'styled-components';
import { apiUrl } from 'configs/server';
import { Token } from 'models/schema';
import { useNativeToken } from 'hooks/useNativeToken';
import { formatNumber } from 'utils/formatNumber';

export const RetherPrice = styled(Text)`
  width: 140px;
  margin: 0 auto;
  padding: 0.1rem;
  justify-content: left;
  align-items: center;
  gap: 5px;
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

export const RetherPriceComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { nativeToken } = useNativeToken();

  const [retherInfos, setRetherInfos] = useState<Token | undefined>(undefined);
  useEffect(() => {
    const fetchRetherInfo = () => {
      setLoading(true);
      return fetch(`${apiUrl}/tokens/address/0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c`)
        .then((res) => res.json())
        .then((d) => {
          setRetherInfos(d);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchRetherInfo();
  }, []);
  return (
    <RetherPrice>
      RETHER
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>${formatNumber(Number(retherInfos?.nativeQuote) * Number(nativeToken?.usdPrice))}</p>
      )}
    </RetherPrice>
  );
};
