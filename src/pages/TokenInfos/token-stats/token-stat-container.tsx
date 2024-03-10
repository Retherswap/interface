import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import { TokenInfosCard } from '../token-infos-card';
import TokenStat from './token-stat';
import Column from 'components/Column';
import { PairModel } from 'models/PairModel';
import { formatNumber } from 'utils/formatNumber';
import TokenVolumeChart from './charts/token-volume-chart/token-volume-chart';
import TokenPriceChart from './charts/token-price-chart/token-price-chart';
import TokenTVLChart from './charts/token-tvl-chart/token-tvl-chart';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';
import { useNativeToken } from 'hooks/useNativeToken';
import { apiUrl } from 'configs/server';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const TokenStatsContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  column-gap: 1.5em;
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
`;

const ChartWrapper = styled.div`
  padding: 5px 1em;
  width: 100%;
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
  border-radius: 2rem 2rem 0 0;
`;

export default function TokenStatContainer({ token }: { token: TokenModel }) {
  const [pairs, setPairs] = useState<PairModel[]>([]);

  useEffect(() => {
    const fetchInfo = () => {
      return fetch(`${apiUrl}/pairs/tokens/${token.address}`)
        .then((res) => res.json())
        .then((d) => setPairs(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [token.address]);
  const volume24h = token.volume
    .filter((tokenVolume) => {
      return new Date(tokenVolume.date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000;
    })
    .reduce((acc, volume) => {
      return acc + Number(volume.usdVolume);
    }, 0);

  const volume7d = pairs.reduce((acc, pair) => {
    const volume = Number(
      pair.idToken0 === token.id
        ? pair.volume.reduce((acc, volume) => acc + Number(volume.token0UsdVolume), 0)
        : pair.volume.reduce((acc, volume) => acc + Number(volume.token1UsdVolume), 0)
    );
    return acc + volume;
  }, 0);
  const nativeToken = useNativeToken();
  const [activeTab, setActiveTab] = useState(1);
  return (
    <TokenStatsContainer>
      <TokenInfosCard style={{ display: 'block', padding: 0 }}>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          style={{ width: '100%', height: '360px', padding: '1.5em' }}
        >
          <SwiperSlide>
            <Column style={{ gap: '1.5em' }}>
              <TokenStat title="TVL" value={`$${formatNumber(token.lastTvl?.reserveUsd)}`}></TokenStat>
              <TokenStat title="Volume 24H" value={`$${formatNumber(volume24h)}`}></TokenStat>
              <TokenStat title="Volume 7D" value={`$${formatNumber(volume7d)}`}></TokenStat>
              <TokenStat title="Holders" value={token.holders} info="Users holding more than 1 token"></TokenStat>
            </Column>
          </SwiperSlide>
          <SwiperSlide>
            <Column style={{ gap: '1.5em' }}>
              <TokenStat title="Circulating supply" value={formatNumber(token.circulatingSupply)}></TokenStat>
              <TokenStat title="Total supply" value={formatNumber(token.totalSupply)}></TokenStat>
              <TokenStat
                title="Market cap"
                value={formatNumber(
                  Number(token.circulatingSupply) *
                    Number(token.nativeQuote) *
                    Number(nativeToken?.nativeToken?.usdPrice ?? 0)
                )}
              ></TokenStat>
              <TokenStat title="Decimals" value={`${token.decimals}`}></TokenStat>
            </Column>
          </SwiperSlide>
        </Swiper>
      </TokenInfosCard>
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
