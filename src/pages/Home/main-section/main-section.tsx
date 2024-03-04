import { ButtonOutlined, ButtonPrimary } from 'components/Button';
import Row from 'components/Row';
import useTheme from 'hooks/useTheme';
import React from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import HomeLogo from '../home-logo/home-logo';
import Column from 'components/Column';
import { NavLink } from 'react-router-dom';

const MainSectionComponent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15vh;
  gap: 2em;
  padding: 2em;
  padding-bottom: 25vh;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 1em;
  padding-bottom: 25vh;
  flex-direction: column-reverse;
  gap: 4em;
  align-items: center;
  text-align: center;
  margin-top: 3vh;
`};
`;

const MainSectionContainer = styled.div`
  position: relative;
  display: flex;
  max-width: 1200px;
  align-items: stretch;
  width: 100%;
  justify-content: space-between;
  gap: 2em;
  padding: 2em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 1em;
  flex-direction: column-reverse;
  gap: 4em;
  align-items: center;
  text-align: center;
  `};
`;

const MainSectionTitle = styled(Fonts.black)`
  font-size: 80px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 70px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 50px;  
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall` 
  font-size: 40px;
`};
`;

const MainSectionSubTitle = styled(Fonts.darkGray)`
  line-height: 1.5em;
  text-align: start;
  font-size: 27px;
  font-weight: 800;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 25px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 23px;  
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall` 
  font-size: 20px;
`};
`;

const MainSectionBackground = styled.div`
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  z-index: -1;
`;

const TitleRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content: center;
`};
`;

export default function MainSection() {
  const theme = useTheme();
  return (
    <MainSectionComponent>
      <MainSectionBackground>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: theme.bg2, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: theme.bg1, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient)"
            d="M804 166.523C520.5 166.523 267.5 290.022 0 304V338.5H1660V0C1358.83 0 1104 166.523 804 166.523Z"
          ></path>
        </svg>
      </MainSectionBackground>
      <MainSectionContainer>
        <Column style={{ gap: '1.2em', maxWidth: '500px' }}>
          <MainSectionTitle>
            Hypra's<br></br>
            <TitleRow style={{ gap: '10px' }}>
              <Fonts.blue2 fontWeight={800}>Main</Fonts.blue2> DEX
            </TitleRow>
          </MainSectionTitle>
          <MainSectionSubTitle>Trade, Swap, Farm, Stake and more inside HYPRA's ecosystem</MainSectionSubTitle>
          <Row style={{ gap: '10px', marginTop: '8px' }}>
            <NavLink to="/swap" style={{ width: '100%', textDecoration: 'none' }}>
              <ButtonPrimary style={{ fontWeight: 800, fontSize: '14px' }}>Trade now</ButtonPrimary>
            </NavLink>
            <a
              href="https://retherswap.org/"
              target="_blank"
              style={{ width: '100%', textDecoration: 'none' }}
              rel="noreferrer noopener"
            >
              <ButtonOutlined style={{ fontWeight: 800, fontSize: '14px' }}> Learn more</ButtonOutlined>
            </a>
          </Row>
        </Column>
        <HomeLogo></HomeLogo>
      </MainSectionContainer>
    </MainSectionComponent>
  );
}
