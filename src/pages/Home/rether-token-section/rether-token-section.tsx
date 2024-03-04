import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import coin3D from '../../../assets/images/3d_coin.png';
import { useNativeToken } from 'hooks/useNativeToken';
import { Token } from 'models/schema';
import { apiUrl } from 'configs/server';
import CurrencyLogo from 'components/CurrencyLogo';
import { useDefaultTokens } from 'hooks/Tokens';
import Row from 'components/Row';
import { NavLink } from 'react-router-dom';
import { ButtonEmpty, ButtonOutlined, ButtonPrimary } from 'components/Button';
import { ExternalLink } from 'react-feather';
import useTheme from 'hooks/useTheme';

const RetherTokenSectionComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top: 10vh;
  padding: 0.2em;
  background-color: ${({ theme }) => theme.bg1};
`;

const RetherTokenSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
  align-items: center;
  max-width: 1000px;
  text-align: center;
`;

const Title = styled(Fonts.black)`
  font-size: 50px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 40px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 40px;  
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall` 
  font-size: 35px;
`};
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
  font-size: 35px;
`};
`;

const Subtitle = styled(Fonts.darkGray)`
  font-size: 30px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 20px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 25px;  
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall` 
  font-size: 20px;
`};
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
  font-size: 18px;
`};
`;

export default function RetherTokenSection() {
  const { nativeToken } = useNativeToken();
  const [retherInfos, setRetherInfos] = useState<Token | undefined>(undefined);
  const defaultTokens = useDefaultTokens();
  useEffect(() => {
    const fetchRetherInfo = () => {
      return fetch(`${apiUrl}/tokens/address/0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c`)
        .then((res) => res.json())
        .then((d) => setRetherInfos(d));
    };
    fetchRetherInfo();
  }, []);
  const theme = useTheme();
  return (
    <RetherTokenSectionComponent>
      <RetherTokenSectionContainer>
        <Title>
          Explore the ecosystem with <span style={{ color: theme.blue2 }}>RETHER</span>
        </Title>
        <Subtitle>
          Rether is the native token of Retherswap and its ecosystem, it is used for governance, staking and way more.
        </Subtitle>
        <Row style={{ gap: '10px', marginTop: '8px', justifyContent: 'center' }}>
          <NavLink
            to="/swap/0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c"
            style={{ width: '140px', textDecoration: 'none' }}
          >
            <ButtonPrimary style={{ fontWeight: 800, fontSize: '14px' }}>Buy Rether</ButtonPrimary>
          </NavLink>
          <a
            href="https://retherswap.org/"
            target="_blank"
            style={{ width: '150px', textDecoration: 'none' }}
            rel="noreferrer noopener"
          >
            <ButtonEmpty style={{ fontWeight: 800, fontSize: '14px' }}>
              <Row style={{ gap: '5px' }}>
                Learn <ExternalLink></ExternalLink>
              </Row>
            </ButtonEmpty>
          </a>
        </Row>
        <CurrencyLogo
          currency={defaultTokens['0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c']}
          size="200px"
        ></CurrencyLogo>
        <Fonts.black fontWeight={800} fontSize={60}>
          RETHER Stats
        </Fonts.black>
        <Fonts.black fontSize={20}>Total Supply : {formatNumber(retherInfos?.totalSupply)}</Fonts.black>
        <Fonts.black fontSize={20}>
          Market cap :{' '}
          {formatNumber(
            Number(retherInfos?.totalSupply ?? 0) *
              Number(retherInfos?.nativeQuote ?? 0) *
              Number(nativeToken?.usdPrice)
          )}
        </Fonts.black>
      </RetherTokenSectionContainer>
    </RetherTokenSectionComponent>
  );
}
