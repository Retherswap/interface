import Logo from 'components/Logo';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HomeLogoIcon from './home-logo-icon/home-logo-icon';
import UsdrLogo from '../../../assets/images/usdr.png';
import HypraLogo from '../../../assets/images/hypra.png';
import EthereumLogo from '../../../assets/images/ethereum_trans-logo.png';
import BnbLogo from '../../../assets/images/bnb_trans-logo.png';
import PolygonLogo from '../../../assets/images/polygon_trans-logo.png';
const HomeLogoContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin: 0 auto;
  width: 500px;
  height: 360px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 350px;
  height: 220px;
`}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 270px;
  height: 190px;
`}
`;

export default function HomeLogo() {
  const [mainRef, setMainRef] = useState<any>(null);
  const parentRef = React.useRef<HTMLDivElement>(null);
  return (
    <HomeLogoContainer ref={parentRef}>
      <HomeLogoIcon
        size={140}
        top={50}
        left={50}
        src="https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/hypra/0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c/logo.png"
        link={false}
        parentRef={parentRef}
        setRef={(ref) => setMainRef(ref)}
      ></HomeLogoIcon>
      <HomeLogoIcon
        size={90}
        top={40}
        left={18}
        src={HypraLogo}
        link={true}
        parentRef={parentRef}
        mainRef={mainRef}
      ></HomeLogoIcon>
      <HomeLogoIcon
        size={90}
        top={50}
        left={82}
        src={PolygonLogo}
        link={true}
        parentRef={parentRef}
        mainRef={mainRef}
      ></HomeLogoIcon>
      <HomeLogoIcon
        size={90}
        top={5}
        left={55}
        src={EthereumLogo}
        link={true}
        parentRef={parentRef}
        mainRef={mainRef}
      ></HomeLogoIcon>
      <HomeLogoIcon
        size={90}
        top={93}
        left={35}
        src={BnbLogo}
        link={true}
        parentRef={parentRef}
        mainRef={mainRef}
      ></HomeLogoIcon>
      <HomeLogoIcon
        size={90}
        top={97}
        left={65}
        src={UsdrLogo}
        link={true}
        parentRef={parentRef}
        mainRef={mainRef}
      ></HomeLogoIcon>
    </HomeLogoContainer>
  );
}
