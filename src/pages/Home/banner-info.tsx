import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import Logo from '../../assets/svg/logo.svg';
import LogoDark from '../../assets/svg/logo_white.svg';
import { useIsDarkMode } from 'state/user/hooks';
import { ButtonEmpty, ButtonPrimary } from 'components/Button';
import { darken } from 'polished';
import Row from 'components/Row';
import Column from 'components/Column';

const BannerInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 192px;
  background-color: ${({ theme }) => theme.primary1};
  padding: 0.75em 1em;
  border-radius: 20px;
`;

const CTAButtonsContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
`;

const CTAButton = styled.button<{ buttonType: CTAButtonType }>`
  width: auto;
  padding: 0.75em 1.5em;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  font-weight: 800;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, 'white')};
    background-color: ${({ theme }) => darken(0.05, 'white')};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, 'white')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, 'white')};
    background-color: ${({ theme }) => darken(0.1, 'white')};
  }
  color: ${({ theme, buttonType }) => (buttonType === 'primary' ? theme.primary1 : 'white')};
  ${({ theme, buttonType }) => (buttonType === 'primary' ? 'background-color:' + 'white' : '')}
`;

export type CTAButtonType = 'primary' | 'empty';

export interface CTAButtonModel {
  label: string;
  url: string;
  type: CTAButtonType;
}

export default function BannerInfo({
  title,
  subTitle,
  ctaButtons,
  image,
}: {
  title: string;
  subTitle: string;
  image: string;
  ctaButtons: CTAButtonModel[];
}) {
  const isDarkMode = useIsDarkMode();
  return (
    <BannerInfoContainer>
      <Column style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-between' }}>
        <img width={'200px'} src={isDarkMode ? LogoDark : Logo} alt="logo" />
        <Column style={{ gap: '10px' }}>
          <Fonts.black fontWeight={800} fontSize={26}>
            {title}
          </Fonts.black>
          <Fonts.black fontWeight={800} fontSize={20}>
            {subTitle}
          </Fonts.black>
        </Column>
        <CTAButtonsContainer>
          {ctaButtons.map((ctaButton) => (
            <CTAButton key={ctaButton.label} buttonType={ctaButton.type}>
              {ctaButton.label}
            </CTAButton>
          ))}
        </CTAButtonsContainer>
      </Column>
      <div style={{ flex: 1, height: '100%' }}>
        <img src={image} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </BannerInfoContainer>
  );
}
