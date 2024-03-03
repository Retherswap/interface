import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TYPE } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import coin3D from '../../../assets/images/3d_coin.png';
import { useNativeToken } from 'hooks/useNativeToken';
import { Token } from 'models/schema';

const RetherTokenSectionComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const RetherTokenSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg1};
`;

export default function RetherTokenSection() {
  const { nativeToken } = useNativeToken();
  const [retherInfos, setRetherInfos] = useState<Token | undefined>(undefined);
  const fetchRetherInfo = () => {
    return fetch('http://162.0.211.141:4000/api/v1/tokens/address/0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c')
      .then((res) => res.json())
      .then((d) => setRetherInfos(d));
  };
  useEffect(() => {
    fetchRetherInfo();
  }, []);
  return (
    <RetherTokenSectionComponent>
      <RetherTokenSectionContainer>
        <TYPE.black fontWeight={800} fontSize={60}>
          Discover the DEX made by RetherSwap
        </TYPE.black>
        <img src={coin3D} alt="rether" style={{ width: '200px', height: '200px' }} />
        <TYPE.black fontWeight={800} fontSize={60}>
          RETHER Stats
        </TYPE.black>
        <TYPE.black fontSize={20}>Total Supply : {formatNumber(retherInfos?.totalSupply)}</TYPE.black>
        <TYPE.black fontSize={20}>
          Market cap :{' '}
          {formatNumber(
            Number(retherInfos?.totalSupply ?? 0) *
              Number(retherInfos?.nativeQuote ?? 0) *
              Number(nativeToken?.usdPrice)
          )}
        </TYPE.black>
      </RetherTokenSectionContainer>
    </RetherTokenSectionComponent>
  );
}
