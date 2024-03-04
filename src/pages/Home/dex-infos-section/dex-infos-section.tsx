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

const DexInfosSectionComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top: 10vh;
  background-color: ${({ theme }) => theme.bg1};
`;

export default function DexInfosSection() {
  return (
    <DexInfosSectionComponent>
      <Fonts.black fontWeight={800} fontSize={60}>
        Discover the DEX made by Retherswap
      </Fonts.black>
    </DexInfosSectionComponent>
  );
}
