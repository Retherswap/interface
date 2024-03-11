import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter';
import Header from '../components/Header';
import Polling from '../components/Header/Polling';
import Popups from '../components/Popups';
import Web3ReactManager from '../components/Web3ReactManager';
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';
import AddLiquidity from './AddLiquidity';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './AddLiquidity/redirects';
import Earn from './Earn';
import Manage from './Earn/Manage';
import Pool from './Pool';
import Vote from './Vote';
import VotePage from './Vote/VotePage';
import PoolFinder from './PoolFinder';
import RemoveLiquidity from './RemoveLiquidity';
// import URLWarning from '../components/Header/URLWarning';
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects';
import Swap from './Swap';
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToHomeOnly, RedirectToSwap } from './Swap/redirects';
import Bridge from './Bridge';
import USDRVault from './USDRVault';
import TokenList from './Tokenlist/token-list';
import TokenInfos from './TokenInfos/token-infos';
import AccountBalance from './Balance/account-balance/account-balance';
import Home from './Home/home';
import { SocketProvider } from 'hooks/useSocket';
import TokenBalance from './Balance/token-balance/token-balance';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';
import useTheme from 'hooks/useTheme';
import { lighten } from 'polished';
import AdminDashboard from './Admin/admin-dashboard/admin-dashboard';
import AdminTokenDashboard from './Admin/admin-dashboard/token-dashboard/token-dashboard';
import AdminConnectModal from 'components/Admin/connect-modal/connect-modal';
import AdminRouteGuard from 'guards/admin-route-guard';
import '../styles/max-container.css';
import AdminManageToken from './Admin/admin-dashboard/token-dashboard/manage-token/manage-token';

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`;

export default function App() {
  const theme = useTheme();
  return (
    <Suspense fallback={null}>
      <Route component={DarkModeQueryParamReader} />
      <Route component={GoogleAnalyticsReporter} />
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <AdminConnectModal />
          <SocketProvider>
            <SkeletonTheme baseColor={theme.bg3} highlightColor={lighten(0.05, theme.bg3)}>
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/swap" component={Swap} />
                  <Route exact strict path="/admin">
                    <AdminRouteGuard>
                      <AdminDashboard></AdminDashboard>
                    </AdminRouteGuard>
                  </Route>
                  <Route exact strict path="/admin/tokens">
                    <AdminRouteGuard>
                      <AdminTokenDashboard></AdminTokenDashboard>
                    </AdminRouteGuard>
                  </Route>
                  <Route exact strict path="/admin/token/:address">
                    <AdminRouteGuard>
                      <AdminManageToken></AdminManageToken>
                    </AdminRouteGuard>
                  </Route>
                  <Route exact strict path="/home" component={Home} />
                  <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/find" component={PoolFinder} />
                  <Route exact strict path="/pool" component={Pool} />
                  <Route exact strict path="/bridge" component={Bridge} />
                  <Route exact strict path="/usdr" component={USDRVault} />
                  <Route exact strict path="/tokens" component={TokenList} />
                  <Route exact strict path="/token/:address" component={TokenInfos} />
                  <Route exact strict path="/balance" component={AccountBalance} />
                  <Route exact strict path="/balance/:tokenAddress" component={TokenBalance} />
                  <Route exact strict path="/farm" component={Earn} />
                  <Route exact strict path="/vote" component={Vote} />
                  <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                  <Route exact path="/add" component={AddLiquidity} />
                  <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact path="/create" component={AddLiquidity} />
                  <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  <Route exact strict path="/farm/:currencyIdA/:currencyIdB" component={Manage} />
                  <Route exact strict path="/vote/:id" component={VotePage} />
                  <Route component={RedirectPathToHomeOnly} />
                </Switch>
              </Web3ReactManager>
            </SkeletonTheme>
          </SocketProvider>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
}
