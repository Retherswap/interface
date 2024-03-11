import Column from 'components/Column';
import Row from 'components/Row';
import FullWidthSkeleton from 'components/Skeleton/full-width-skeleton';
import { rgba } from 'polished';
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Info } from 'react-feather';
import { useIsDarkMode } from 'state/user/hooks';
import styled from 'styled-components';
import { Fonts } from 'theme';
const Stat = styled.div`
  display: flex;
  gap: 5px;
  user-select: none;
  align-items: bottom;
`;

const InfoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InfoTooltip = styled.div<{ darkMode: boolean }>`
  position: absolute;
  top: -20px;
  right: -100%;
  transform: translateX(100%);
  background-color: ${({ theme }) => theme.bg1};
  padding: 10px;
  border-radius: 10px;
  width: 100px;
  box-shadow: 0 0 1px 1px ${({ darkMode }) => (darkMode ? rgba(255, 255, 255, 0.1) : rgba(0, 0, 0, 0.1))};
  z-index: 1000;
`;

export default function TokenStat({
  title,
  value,
  loading,
  percentChange,
  info,
}: {
  title: string;
  value: string | undefined;
  loading?: boolean;
  percentChange?: number | undefined;
  info?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const isDarkMode = useIsDarkMode();
  return (
    <Stat>
      <Column style={{ gap: '5px', width: '100%' }}>
        <Row style={{ gap: '5px' }}>
          <Fonts.blue fontWeight={800} fontSize={13}>
            {title}
          </Fonts.blue>
          {info && (
            <InfoContainer
              onTouchStart={() => {
                setShowInfo(true);
              }}
              onTouchEnd={() => {
                setShowInfo(false);
              }}
              onMouseEnter={() => {
                setShowInfo(true);
              }}
              onMouseLeave={() => {
                setShowInfo(false);
              }}
            >
              <Fonts.blue style={{ display: 'flex', alignItems: 'center' }} fontWeight={800} fontSize={13}>
                <Info size={13}></Info>
              </Fonts.blue>
              {showInfo && (
                <InfoTooltip darkMode={isDarkMode}>
                  <Fonts.blue fontWeight={600} fontSize={12}>
                    {info}
                  </Fonts.blue>
                </InfoTooltip>
              )}
            </InfoContainer>
          )}
        </Row>
        <Row style={{ width: '100%', justifyContent: 'space-between' }}>
          {loading ? (
            <Fonts.black fontWeight={600} fontSize={25}>
              {value}
            </Fonts.black>
          ) : (
            <FullWidthSkeleton width="50%"></FullWidthSkeleton>
          )}
          {percentChange && (
            <div style={{ display: 'flex' }}>
              {percentChange > 0 ? (
                <>
                  <Fonts.green>
                    <ArrowUp size={'15px'}></ArrowUp>
                  </Fonts.green>
                  <Fonts.green fontWeight={500} fontSize={15}>
                    {percentChange}%
                  </Fonts.green>
                </>
              ) : (
                <>
                  <Fonts.red>
                    <ArrowDown size={'15px'}></ArrowDown>
                  </Fonts.red>
                  <Fonts.red fontWeight={500} fontSize={15}>
                    {Math.abs(percentChange)}%
                  </Fonts.red>
                </>
              )}
            </div>
          )}
        </Row>
      </Column>
    </Stat>
  );
}
