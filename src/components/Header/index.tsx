import { ChainId } from '@retherswap/sdk';
import React from 'react';
import { Text } from 'rebass';
import { NavLink } from 'react-router-dom';
import { darken } from 'polished';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Logo from '../../assets/svg/logo.svg';
import LogoDark from '../../assets/svg/logo_white.svg';
import { useActiveWeb3React } from '../../hooks';
import { useDarkModeManager } from '../../state/user/hooks';
import { useETHBalances } from '../../state/wallet/hooks';

import { LightCard } from '../Card';
import { Moon, Sun } from 'react-feather';
import Row, { RowFixed } from '../Row';
import Web3Status from '../Web3Status';
import { ETH_NAME_AND_SYMBOL } from '../../constants';

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
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

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
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;
  background-color: ${({ theme }) => theme.bg1};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0;
    margin-right: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: fixed;
    bottom: 0;
    padding: .5rem;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0;
    border-top: 1px solid ${({ theme }) => theme.bg3};
  `};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 0.8rem;
  white-space: nowrap;
  width: auto;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 24px 32px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  :focus {
    border: 1px solid blue;
  }
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const HideSmall2 = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  img {
    width: 150px; // Set the width to the desired size
  }
  `};
`;

const CenteredNetworkCard = styled.div`
  // Positioning styles for right side with 20px margin to the left
  position: fixed;
  top: 42.5%;
  right: 30px; // Adjust the margin to 20px from the right
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end; // Align to the right

  // Styling
  background-color: ${({ theme }) => theme.bg1}; // Adjust the background color if needed
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4); // Darker shadow

  // Additional styling if needed
  text-align: left; // Align text to the left
  max-width: 400px; // Adjust the maximum width as needed
`;

const CloseButton = styled.button`
  // Close button styles
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.text2};

  &:hover {
    color: ${({ theme }) => theme.text1};
  }
`;

const NetworkCard = styled(LightCard)`
  border-radius: 0.8rem;
  padding: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 0;
  margin-right: 0.5rem;
  width: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
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
  margin-right: 12px;
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
    transform: scale(0.9);
  }
`;

const activeClassName = 'ACTIVE';

const StyledNavExternalLink = styled.a`
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

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 8px;
    padding: 0.3rem 7%;
    border: 1px solid ${({ theme }) => theme.bg3};

    &:not(:last-child) {
      margin-right: 2%;
    }
  `};
`;

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
    border-radius: 8px;
    padding: 0.3rem 7%;
    border: 1px solid ${({ theme }) => theme.bg3};

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
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Goerli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.BITGERT]: 'BITGERT',
  [ChainId.DOGE]: 'DOGE',
  [ChainId.DOKEN]: 'DOKEN',
  [ChainId.FUSE]: 'FUSE',
  [ChainId.RTH]: '',
};

export default function Header() {
  const { account, chainId } = useActiveWeb3React();
  const { t } = useTranslation();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const [darkMode, toggleDarkMode] = useDarkModeManager();
  const [showTextBox, setShowTextBox] = React.useState(false);

  const toggleTextBox = () => {
    setShowTextBox(!showTextBox);
  };
  return (
    <HeaderFrame>
      <HeaderRow>
        <HideSmall2>
          <Title href=".">
            <Icon>
              <img width={'300px'} src={darkMode ? LogoDark : Logo} alt="logo" />
            </Icon>
          </Title>
        </HideSmall2>
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
        <HideSmall>
          <StyledNavExternalLink id={`bridge-nav-link`} href={'https://farm.retherswap.org/'} target="_blank">
            {t('Liquidity Farm (Soon)')}
          </StyledNavExternalLink>
        </HideSmall>
      </HeaderLinks>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            <NetworkCard>
              <StyledNavExternalLink id={``} href={'https://explorer.rethereum.org/'} target="_blank">
                {t('Explorer')}
              </StyledNavExternalLink>
            </NetworkCard>
          </HideSmall>
          <HideSmall>
            <NetworkCard>
              <StyledNavExternalLink id={``} href={'https://rethereum.org/'} target="_blank">
                {t('Bridge')}
              </StyledNavExternalLink>
            </NetworkCard>
          </HideSmall>
          <HideSmall>
            <NetworkCard>
              <StyledNavExternalLink
                id={``}
                href={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  toggleTextBox();
                }}
              >
                AddNetwork
              </StyledNavExternalLink>
            </NetworkCard>
          </HideSmall>
          <HideSmall>
            {showTextBox && (
              <CenteredNetworkCard>
                <CloseButton onClick={toggleTextBox}>&times;</CloseButton>
                <div>
                  <Text>
                    <strong>Chain ID:</strong> <br /> 622277
                    <br /> <br />
                    <strong>Chain Name:</strong> <br /> Rethereum Mainnet
                    <br /> <br />
                    <strong>Currency symbol:</strong> <br /> RTH
                    <br /> <br />
                    <strong>Decimals:</strong> <br /> 18
                    <br /> <br />
                    <strong>RPC-URL:</strong> <br /> https://rpc.rethereum.org
                    <br /> <br />
                    <strong>Block Explorer:</strong> <br /> https://explorer.rethereum.org
                    <br /> <br />
                  </Text>
                </div>
              </CenteredNetworkCard>
            )}
          </HideSmall>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
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
          <StyledMenuButton onClick={toggleDarkMode}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  );
}
