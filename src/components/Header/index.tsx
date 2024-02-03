import { ChainId } from '@retherswap/sdk';
import React from 'react';
import { Text } from 'rebass';
import { NavLink } from 'react-router-dom';
import { darken } from 'polished';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Menu from '../Menu';
import Logo from '../../assets/svg/logo.svg';
import LogoDark from '../../assets/svg/logo_white.svg';
import { useActiveWeb3React } from '../../hooks';
import { useDarkModeManager } from '../../state/user/hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { Moon, Sun } from 'react-feather';
import Row, { RowFixed } from '../Row';
import Web3Status from '../Web3Status';
import { ETH_NAME_AND_SYMBOL } from '../../constants';
import NetworkSelector from './NetworkSelector'

const HeaderFrame = styled.div`
  width: 100vw;
  margin: 1rem auto;
  padding: 1rem 1.6rem;
  z-index: 2;
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 60px 1fr 120px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 60px 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  transform: translateY(50%) translateX(100%);
`};
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`;

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: center;
  

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`;

const HeaderLinks = styled(Row)`
  width: auto;
  margin: 0 auto;
  padding: 0.5rem;
  justify-content: center;
  border-radius: 0.8rem;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background-color: ${({ theme }) => theme.bg1};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0;
    margin-right: auto;
  
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: .4rem;
    width: 110%;
    transform: translateY(0%) translateX(-15%);
    border-radius: 4;
  `};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg1)};
  border-radius: 0.8rem;
  white-space: nowrap;
  width: auto;
  cursor: pointer;
  padding: 0.1rem;

  :focus {
    border: 1px solid blue;
  }
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const Icon = styled.div`
  transition: transform 0.2s ease;
  :hover {
    transform: scale(1.1);
  }
`;

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 0.8rem;
  width: fit-content;
  padding: 0.3rem 0.6rem;
  font-weight: 500;
  transition: 0.2s;

  &:not(:last-child) {
    margin-right: 0.16rem;
  }

  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg3};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 10px;
    padding: 0.2rem 5%;
    border: 0px solid ${({ theme }) => theme.bg3};

    &:not(:last-child) {
      margin-right: 2%;
    }
  `};
`;

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg1};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;


  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 0px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.MATIC]: 'Matic',
  [ChainId.BNB]: 'BNB',
  [ChainId.HYPRA]: 'HYPRA',
};

export default function Header() {
  const { account, chainId } = useActiveWeb3React();
  const { t } = useTranslation();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const [darkMode, toggleDarkMode] = useDarkModeManager();
  return (
    <HeaderFrame>
      <HeaderRow>
          <Title href=".">
            <Icon>
              <HideSmall>
              <img width={'300px'} src={darkMode ? LogoDark : Logo} alt="logo" />
              </HideSmall>
            </Icon>
          </Title>
      </HeaderRow>
      <HeaderLinks>
        <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
          {t('Swap')}
        </StyledNavLink>
        <StyledNavLink
          id={`pool-nav-link`}
          to={'/pool'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/create') ||
            pathname.startsWith('/find')
          }
        >
          {t('Liquidity')}
        </StyledNavLink>
        <StyledNavLink id={`stake-nav-link`} to={'/farm'}>
          {t('Farm')}
        </StyledNavLink>
        <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
          {t('Vote')}
        </StyledNavLink>
      </HeaderLinks>
      <HeaderControls>
        <HeaderElement>
        <NetworkSelector />
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {chainId ? ETH_NAME_AND_SYMBOL[chainId].symbol : 'Native Tokens'}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
          <HideSmall>
          <Menu />
          </HideSmall>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  );
}
