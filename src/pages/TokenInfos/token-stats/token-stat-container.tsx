import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import { TokenInfosCard } from '../token-infos-card';
import TokenStat from './token-stat';
import { formatNumber } from 'utils/formatNumber';
import TokenVolumeChart from './charts/token-volume-chart/token-volume-chart';
import TokenPriceChart from './charts/token-price-chart/token-price-chart';
import TokenTVLChart from './charts/token-tvl-chart/token-tvl-chart';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';
import { useNativeToken } from 'hooks/useNativeToken';
import { Pair, Token } from 'models/schema';
import { useWindowSize } from 'hooks/useWindowSize';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const TokenStatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 3em;
  gap: 3em;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall` 
  grid-template-columns: 100%;
  row-gap: 3em;
 `};
`;

const ChartContainer = styled(TokenInfosCard)`
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  gap: 0;
`;

const ChartWrapper = styled.div`
  width: 100%;
  min-height: 500px;
  flex: 1;
`;

const TokenChartTabContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bg2};
`;
// add active state to the tab
const TokenChartTab = styled.div<{ active?: boolean }>`
  flex: 1;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme, active }) => (active ? theme.bg1 : theme.bg2)};
  padding: 1em;
  text-align: center;
  transition: background-color 0.4s;
  border-radius: 1.5em 1.5em 0 0;
`;

const TokenStats = styled.div`
  display: grid;
  row-gap: 1em;
  position: relative;
  width: 100%;
`;

export default function TokenStatContainer({ token, pairs }: { token?: Token; pairs: Pair[] }) {
  const volume24h = useMemo(() => {
    if (!token || !token.volume) {
      return undefined;
    }
    return token.volume
      .filter((tokenVolume) => {
        return new Date(tokenVolume.date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000;
      })
      .reduce((acc, volume) => {
        return acc + Number(volume.usdVolume);
      }, 0);
  }, [token]);

  const volume7d = useMemo(() => {
    if (!pairs || !token) {
      return undefined;
    }
    return pairs.reduce((acc, pair) => {
      const volume = Number(
        pair.idToken0 === token.id
          ? pair.volume?.reduce((acc, volume) => acc + Number(volume.token0UsdVolume), 0)
          : pair.volume?.reduce((acc, volume) => acc + Number(volume.token1UsdVolume), 0)
      );
      return acc + volume;
    }, 0);
  }, [pairs, token]);
  const nativeToken = useNativeToken();
  const [activeTab, setActiveTab] = useState(2);
  const currentWidth = useWindowSize().width ?? 0;
  return (
    <TokenStatsContainer>
      <TokenStats>
        <Swiper
          spaceBetween={20}
          slidesPerView={currentWidth < 800 ? 2 : currentWidth < 1200 ? 3 : 4}
          style={{ width: '100%', padding: '0.5em' }}
        >
          <SwiperSlide>
            <TokenStat
              title="Market cap"
              value={formatNumber(
                Number(token?.circulatingSupply) *
                  Number(token?.nativeQuote) *
                  Number(nativeToken?.nativeToken?.usdPrice ?? 0)
              )}
              loading={token !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat
              title="Volume 24H"
              value={`$${formatNumber(volume24h)}`}
              loading={volume24h !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat
              title="Volume 7D"
              value={`$${formatNumber(volume7d)}`}
              loading={volume7d !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat
              title="Holders"
              value={token?.holders.toString()}
              info="Users holding more than 1 token"
              loading={token !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat
              title="TVL"
              value={`$${formatNumber(token?.lastTvl?.reserveUsd)}`}
              loading={token !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat
              title="Circulating supply"
              value={formatNumber(token?.circulatingSupply)}
              loading={token !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat
              title="Total supply"
              value={formatNumber(token?.totalSupply)}
              loading={token !== undefined}
            ></TokenStat>
          </SwiperSlide>
          <SwiperSlide>
            <TokenStat title="Decimals" value={`${token?.decimals}`} loading={token !== undefined}></TokenStat>
          </SwiperSlide>
        </Swiper>
      </TokenStats>
      <ChartContainer>
        <TokenChartTabContainer>
          <TokenChartTab active={activeTab === 0} onClick={() => setActiveTab(0)}>
            <Fonts.black fontWeight={540} fontSize={16}>
              Volume
            </Fonts.black>
          </TokenChartTab>
          <TokenChartTab active={activeTab === 1} onClick={() => setActiveTab(1)}>
            <Fonts.black fontWeight={540} fontSize={16}>
              TVL
            </Fonts.black>
          </TokenChartTab>
          <TokenChartTab active={activeTab === 2} onClick={() => setActiveTab(2)}>
            <Fonts.black fontWeight={540} fontSize={16}>
              Price
            </Fonts.black>
          </TokenChartTab>
        </TokenChartTabContainer>
        <ChartWrapper>
          {activeTab === 0 && <TokenVolumeChart token={token}></TokenVolumeChart>}
          {activeTab === 1 && <TokenTVLChart token={token}></TokenTVLChart>}
          {activeTab === 2 && <TokenPriceChart token={token}></TokenPriceChart>}
        </ChartWrapper>
      </ChartContainer>
    </TokenStatsContainer>
  );
}
