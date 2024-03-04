import { AppInfo } from 'models/schema';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';
import MainSection from './main-section/main-section';
import DexStatsSection from './dex-stats-section/dex-stats-section';
import { useSocket } from 'hooks/useSocket';
import { apiUrl } from 'configs/server';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
`}
`;

export default function Home() {
  const [appInfos, setAppInfos] = useState<AppInfo | undefined>(undefined);
  const updateAppInfos = (data: AppInfo) => {
    setAppInfos((currentAppInfos) => {
      return { ...currentAppInfos, ...data };
    });
  };
  const socket = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    const onAppInfos = (data: AppInfo) => {
      updateAppInfos(data);
    };
    socket.on('appInfos', onAppInfos);
    const fetchInfo = () => {
      return fetch(`${apiUrl}/app_infos`)
        .then((res) => res.json())
        .then((d) => setAppInfos(d));
    };
    fetchInfo();
    return () => {
      socket.off('appInfos', onAppInfos);
    };
  }, [socket]);
  /*
   <Swiper
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        style={{ width: '100%', padding: '2em 0', maxWidth: '1200px' }}
      >
        <SwiperSlide>
          <BannerInfo
            title="Hypra listing on bitmart"
            subTitle="Wtf we gonna moon (nope)"
            image={RetherswapLogo}
            ctaButtons={[
              { label: 'Trade now', url: 'https://bitmart.com', type: 'primary' },
              { label: 'Learn more', url: 'https://bitmart.com', type: 'primary' },
            ]}
          ></BannerInfo>
        </SwiperSlide>
        <SwiperSlide>
          <BannerInfo
            title="Hypra listing on bitmart"
            subTitle="Wtf we gonna moon (nope)"
            image={RetherswapLogo}
            ctaButtons={[
              { label: 'Trade now', url: 'https://bitmart.com', type: 'primary' },
              { label: 'Learn more', url: 'https://bitmart.com', type: 'primary' },
            ]}
          ></BannerInfo>
        </SwiperSlide>
      </Swiper>
      */
  /*
           <DexInfosSection></DexInfosSection>
      <RetherTokenSection></RetherTokenSection>
      */
  return (
    <HomeContainer>
      <MainSection></MainSection>
      <DexStatsSection appInfos={appInfos}></DexStatsSection>
    </HomeContainer>
  );
}
