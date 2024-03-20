import React, { useMemo } from 'react';
import { ChainId } from '@retherswap/sdk';
import { Text } from 'rebass';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../assets/svg/logo.svg';
import LogoDark from '../../assets/svg/logo_white.svg';
import { useActiveWeb3React } from '../../hooks';
import { useDarkModeManager } from '../../state/user/hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { Moon, Sun } from 'react-feather';
import Row, { RowFixed } from '../Row';
import Web3Status from '../Web3Status';
import { ETH_NAME_AND_SYMBOL } from '../../constants';
import NetworkSelector from './NetworkSelector';
import HeaderNavigationMenu from './HeaderNavigationMenu';
import { useSelector } from 'react-redux';
import { AppState } from 'state';

const HeaderFrame = styled.div<{ showHeader: boolean }>`
  width: 100vw;
  margin: 1rem auto;
  padding: 1rem 1.6rem;
  padding-bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: column;
    gap: 1em;
    justify-content: center;
  `};
  ${({ theme, showHeader }) => theme.mediaHeight.upToMedium`
    display: ${showHeader ? 'flex' : 'none'};
`}
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  justify-content: flex-end;
  flex: 1;
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
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content: center;
 `};
`;

const HeaderLinks = styled(Row)`
  display: flex;
  justify-content: center;
  flex: 1;
  max-width: 320px;
  padding: 0.5em 0.6em;
  gap: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
  background-color: ${({ theme }) => theme.bg1};
`;

const AccountElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 0.8rem;
  white-space: nowrap;
  width: auto;
  cursor: pointer;
  padding: 0.1rem;

  :focus {
    border: 1px solid blue;
  }
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled(NavLink)`
  display: flex;
  align-items: center;&
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
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const [darkMode, toggleDarkMode] = useDarkModeManager();
  const showHeader = useSelector((state: AppState) => state.application.showHeader);
  const isAdmin = useSelector((state: AppState) => state.application.isAdmin);
  const otherLinks = useMemo(() => {
    if (isAdmin) {
      return [
        { title: 'Admin', link: '/admin' },
        { title: 'About', link: 'https://retherswap.org', external: true },
        { title: 'Docs', link: 'https://docs.retherswap.org', external: true },
        { title: 'Code', link: 'https://github.com/Retherswap', external: true },
        { title: 'Discord', link: 'https://discord.gg/xCB4AJDEFb', external: true },
        { title: 'TradingView', link: 'https://www.tradingview.com/', external: true },
        { title: 'Geckoterminal', link: 'https://www.geckoterminal.com/hypra-network/pools', external: true },
      ];
    }
    return [
      { title: 'About', link: 'https://retherswap.org', external: true },
      { title: 'Docs', link: 'https://docs.retherswap.org', external: true },
      { title: 'Code', link: 'https://github.com/Retherswap', external: true },
      { title: 'Discord', link: 'https://discord.gg/xCB4AJDEFb', external: true },
      { title: 'TradingView', link: 'https://www.tradingview.com/', external: true },
      { title: 'Geckoterminal', link: 'https://www.geckoterminal.com/hypra-network/pools', external: true },
    ];
  }, [isAdmin]);
  return (
    <HeaderFrame showHeader={showHeader}>
      <HeaderRow>
        <Title to="/">
          <Icon>
            <img width={'300px'} src={darkMode ? LogoDark : Logo} alt="logo" />
          </Icon>
        </Title>
      </HeaderRow>
      <Row style={{ justifyContent: 'center', flex: 1 }}>
        <HeaderLinks>
          <HeaderNavigationMenu
            title={'Trade'}
            defaultLink={'/swap'}
            content={[
              { title: 'Swap', link: '/swap' },
              { title: 'Balance', link: '/balance' },
              { title: 'Tokens', link: '/tokens' },
              { title: '🚧Bridge' },
              { title: '🚧USDR Vault' },
            ]}
          ></HeaderNavigationMenu>
          <HeaderNavigationMenu
            title={'Earn'}
            defaultLink={'/pool'}
            content={[
              { title: 'Liquidity', link: '/pool' },
              { title: 'Farm', link: '/farm' },
              { title: '🚧USDR Yield' },
            ]}
          ></HeaderNavigationMenu>
          <HeaderNavigationMenu title={'Vote'} defaultLink={'/vote'}></HeaderNavigationMenu>
          <HeaderNavigationMenu title={'Others'} content={otherLinks}></HeaderNavigationMenu>
        </HeaderLinks>
      </Row>
      <HeaderControls>
        <HeaderElement>
          <NetworkSelector />
          <AccountElement style={{ pointerEvents: 'auto' }}>
            <Link to="/balance" style={{ textDecoration: 'none', color: 'unset' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} {chainId ? ETH_NAME_AND_SYMBOL[chainId].symbol : 'Native Tokens'}
                </BalanceText>
              ) : null}{' '}
            </Link>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  );
}
