import React, { useEffect, useState } from 'react';
import { useIsDarkMode } from 'state/user/hooks';
import { serverUrl } from 'configs/server';
import { RetherswapDataFeed } from 'utils/retherswap-data-feed';
import { useSocket } from 'hooks/useSocket';
import { Token } from 'models/schema';
import { useActiveWeb3React } from 'hooks/web3';
import { useNativeToken } from 'hooks/useNativeToken';
import { widget as twWidget, ResolutionString } from 'utils/trading-view/charting_library';
import { useWindowSize } from 'hooks/useWindowSize';
export default function TokenPriceChart({ token }: { token?: Token }) {
  const isDarkMode = useIsDarkMode();
  const socket = useSocket();
  const web3 = useActiveWeb3React();
  const { nativeToken } = useNativeToken();
  const size = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mobile = (size?.width ?? 0) < 768;
    if (mobile !== isMobile) {
      setIsMobile(mobile);
    }
  }, [size, isMobile, setIsMobile]);
  const tokenName = token?.name;
  const [dataFeed, setDataFeed] = useState<RetherswapDataFeed | undefined>(undefined);
  useEffect(() => {
    if (!socket || !token || !nativeToken) {
      return;
    }
    if (dataFeed) {
      dataFeed.setToken(token);
    } else {
      setDataFeed(new RetherswapDataFeed(socket, token, nativeToken, web3.account));
    }
  }, [socket, token, nativeToken, web3, dataFeed, setDataFeed]);
  useEffect(() => {
    if (!dataFeed) {
      return;
    }
    if (!document.getElementById('tv_chart_container')) return;
    const widget = ((window as any).tvWidget = new twWidget({
      library_path: `${serverUrl}/assets/trading_view/`,
      fullscreen: false,
      theme: isDarkMode ? 'dark' : 'light',
      symbol: tokenName,
      interval: '1D' as ResolutionString,
      container: 'tv_chart_container',
      datafeed: dataFeed,
      locale: 'en',
      disabled_features: [
        'header_symbol_search',
        'save_chart_properties_to_local_storage',
        'control_bar',
        'header_quick_search',
        'header_screenshot',
        'display_market_status',
        isMobile ? 'left_toolbar' : 'display_market_status',
      ],
      enabled_features: ['iframe_loading_compatibility_mode'],
      height: '100%' as any,
      width: '100%' as any,
    }));
    widget.headerReady().then(function () {
      let showTransactions = true;
      const button = widget.createButton({ align: 'left', useTradingViewStyle: false });
      const refreshButton = (show: boolean) => {
        if (show) {
          widget.activeChart().refreshMarks();
        } else {
          widget.activeChart().clearMarks();
        }
        button.innerHTML = `
        <div style="display:flex; align-items:center; gap:5px"> 
            <input type="checkbox" ${show ? 'checked' : ''}>
          <span>Show transactions</span>
        </div>`;
        showTransactions = show;
      };
      button.addEventListener('click', function () {
        refreshButton(!showTransactions);
      });
      refreshButton(showTransactions);
    });
    return () => {
      widget.remove();
    };
  }, [isDarkMode, dataFeed, tokenName, isMobile]);
  return (
    <>
      <div id="tv_chart_container" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
}
