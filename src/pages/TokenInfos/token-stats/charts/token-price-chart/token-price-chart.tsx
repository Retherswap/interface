import React, { useEffect } from 'react';
import { useIsDarkMode } from 'state/user/hooks';
import { serverUrl } from 'configs/server';
import { RetherswapDataFeed } from 'utils/retherswap-data-feed';
import { useSocket } from 'hooks/useSocket';
import { Token } from 'models/schema';
import { useActiveWeb3React } from 'hooks/web3';
import { useNativeToken } from 'hooks/useNativeToken';
import { widget as twWidget, ResolutionString } from 'utils/trading-view/charting_library';
export default function TokenPriceChart({ token }: { token?: Token }) {
  const isDarkMode = useIsDarkMode();
  const socket = useSocket();
  const web3 = useActiveWeb3React();
  const { nativeToken } = useNativeToken();
  useEffect(() => {
    if (!socket || !token || !web3?.account || !nativeToken) {
      return;
    }
    if (!document.getElementById('tv_chart_container')) return;
    const widget = ((window as any).tvWidget = new twWidget({
      library_path: `${serverUrl}/assets/trading_view/`,
      fullscreen: false,
      theme: isDarkMode ? 'dark' : 'light',
      symbol: token.name,
      interval: '1D' as ResolutionString,
      container: 'tv_chart_container',
      datafeed: new RetherswapDataFeed(socket, token, nativeToken, web3.account),
      locale: 'en',
      disabled_features: [
        'header_symbol_search',
        'save_chart_properties_to_local_storage',
        'control_bar',
        'header_quick_search',
        'header_screenshot',
        'display_market_status',
      ],
      enabled_features: [],
      height: '100%' as any,
      width: '100%' as any,
    }));
    return () => {
      widget.remove();
    };
  }, [isDarkMode, socket, token, web3, nativeToken]);
  return (
    <>
      <div id="tv_chart_container" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
}
