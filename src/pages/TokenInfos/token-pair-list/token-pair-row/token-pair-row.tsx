import { TokenModel } from 'models/TokenModel';
import React, { useMemo } from 'react';
import { PairModel } from 'models/PairModel';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { TokenPairListGrid } from '../token-pair-list-grid';
import Row from 'components/Row';
import { HideSmall, Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import { HideExtraSmall } from 'components/Hide/hide-extra-small';
import { useCurrency } from 'hooks/useCurrency';
import FullWidthSkeleton from 'components/Skeleton/full-width-skeleton';

export default function TokenPairRow({ index, token, pair }: { index?: number; token?: TokenModel; pair?: PairModel }) {
  const volume24h = useMemo(() => {
    if (!pair || !token) {
      return undefined;
    }
    return Number(
      pair.idToken0 === token.id
        ? pair.volume
            .filter((pairVolume) => {
              return new Date(pairVolume.date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000;
            })
            .reduce((acc, volume) => acc + Number(volume.token0UsdVolume), 0)
        : pair.volume
            .filter((pairVolume) => {
              return new Date(pairVolume.date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000;
            })
            .slice(0, 24)
            .reduce((acc, volume) => acc + Number(volume.token1UsdVolume), 0)
    );
  }, [pair, token]);
  const volume7d = useMemo(() => {
    if (!pair || !token) {
      return undefined;
    }
    return Math.floor(
      Number(
        pair.idToken0 === token.id
          ? pair.volume.reduce((acc, volume) => acc + Number(volume.token0UsdVolume), 0)
          : pair.volume.reduce((acc, volume) => acc + Number(volume.token1UsdVolume), 0)
      )
    );
  }, [pair, token]);
  const currency0 = useCurrency(pair?.token0.address);
  const currency1 = useCurrency(pair?.token1.address);
  return (
    <TokenPairListGrid>
      <HideExtraSmall>
        <Fonts.black fontWeight={500} fontSize={15}>
          {index}
        </Fonts.black>
      </HideExtraSmall>
      <Row style={{ gap: '10px' }}>
        <DoubleCurrencyLogo size={22} currency0={currency0} currency1={currency1} />
        {pair ? (
          <Fonts.black fontWeight={500} fontSize={14}>
            {pair.token0.symbol}/{pair.token1.symbol}
          </Fonts.black>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </Row>
      {pair ? (
        <Fonts.black fontWeight={500} fontSize={14}>
          ${formatNumber(pair.lastTvl?.reserveUsd)}
        </Fonts.black>
      ) : (
        <FullWidthSkeleton width="75%"></FullWidthSkeleton>
      )}
      <HideSmall>
        {volume24h !== undefined ? (
          <Fonts.black fontWeight={500} fontSize={14}>
            ${formatNumber(volume24h)}
          </Fonts.black>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </HideSmall>
      <HideSmall>
        {volume7d !== undefined ? (
          <Fonts.black fontWeight={500} fontSize={14}>
            ${formatNumber(volume7d)}
          </Fonts.black>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </HideSmall>
    </TokenPairListGrid>
  );
}
