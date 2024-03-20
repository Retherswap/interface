import React, { useMemo, useState } from 'react';
import { formatNumber } from 'utils/formatNumber';
import ReactApexChart from 'react-apexcharts';
import { useIsDarkMode } from 'state/user/hooks';
import useTheme from 'hooks/useTheme';
import styled from 'styled-components';
import { Balance, BalanceChange, TokenPrice } from 'models/schema';
import { useNativeToken } from 'hooks/useNativeToken';
import areaChartSkeletonData from 'components/Skeleton/area-chart-skeleton-data';

const AccountBalanceChartWrapper = styled.div<{ isLoading: boolean }>`
  width: calc(100% + 10px);
  margin-left: -8px;
  transition: filter 0.25s;
  &:hover {
    filter: drop-shadow(0 0 10px ${({ theme, isLoading }) => (isLoading ? 'gray' : theme.primary1)});
  }
`;

export default function AccountBalanceChart({ balances }: { balances?: Balance[] }) {
  const [data, setData] = useState<any[]>(areaChartSkeletonData);
  const [loading, setLoading] = useState(true);
  const { nativeToken } = useNativeToken();
  const findNearestPrice = (prices: TokenPrice[], date: Date) => {
    let start = 0;
    let end = prices.length - 1;
    while (start <= end) {
      let mid = Math.floor((start + end) / 2);
      if (new Date(prices[mid].date).getTime() === date.getTime()) {
        return prices[mid];
      } else if (new Date(prices[mid].date).getTime() < date.getTime()) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    if (start >= prices.length) return prices[prices.length - 1];
    if (end < 0) return prices[0];
    const distStart = Math.abs(new Date(prices[start].date).getTime() - date.getTime());
    const distEnd = Math.abs(date.getTime() - new Date(prices[end].date).getTime());
    return distStart < distEnd ? prices[start] : prices[end];
  };
  const findNearestBalanceChange = (balanceChanges: BalanceChange[], date: Date) => {
    let start = 0;
    let end = balanceChanges.length - 1;
    let max = 0;
    while (start <= end && max < 10) {
      let mid = Math.floor((start + end) / 2);
      if (new Date(balanceChanges[mid].date).getTime() === date.getTime()) {
        return balanceChanges[mid];
      } else if (new Date(balanceChanges[mid].date).getTime() < date.getTime()) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
      ++max;
    }
    if (start >= balanceChanges.length) return balanceChanges[balanceChanges.length - 1];
    if (end < 0) return balanceChanges[0];
    const distStart = Math.abs(new Date(balanceChanges[start].date).getTime() - date.getTime());
    const distEnd = Math.abs(date.getTime() - new Date(balanceChanges[end].date).getTime());
    return distStart < distEnd ? balanceChanges[start] : balanceChanges[end];
  };
  useMemo(() => {
    if (!balances || balances.length === 0) {
      return;
    }
    if (!nativeToken) return;
    const data: any[] = [];
    const now = new Date();
    for (let i = 0; i < 24 * 7; ++i) {
      let time: any = now.getTime() - i * 60 * 60 * 1000;
      time = new Date(time);
      time.setMinutes(0, 0, 0);
      let price = 0;
      for (const balance of balances) {
        if (!balance.token.price || !balance.balanceChanges) {
          continue;
        }
        const balanceAmount = findNearestBalanceChange(balance.balanceChanges, time)?.amount ?? Number(balance.balance);
        const nearestPrice = findNearestPrice(balance.token.price, time);
        if (!nearestPrice || !balanceAmount) {
          continue;
        }
        price += Number(nearestPrice.usdQuote) * Number(balanceAmount);
      }
      data.push({
        x: time.getTime(),
        y: price.toFixed(),
      });
    }
    setData(data);
    setLoading(false);
  }, [balances, nativeToken]);
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();
  return (
    <AccountBalanceChartWrapper isLoading={loading}>
      <ReactApexChart
        type="area"
        options={{
          theme: { mode: isDarkMode ? 'dark' : 'light' },
          chart: {
            toolbar: { show: false },
            zoom: {
              enabled: false,
            },
            background: 'transparent',
          },
          yaxis: {
            labels: {
              show: false,
              formatter: (value) => {
                return '$' + formatNumber(value, { reduce: false });
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            labels: {
              show: false,
              formatter: (value) => {
                return new Date(value).toLocaleString();
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          grid: {
            show: false,
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          },
          stroke: {
            curve: 'straight',
            lineCap: 'square',
            colors: [loading ? 'gray' : theme.primary1],
            width: 2,
          },
          tooltip: {
            enabled: !loading,
            style: {
              fontFamily: 'Roboto, sans-serif !important',
            },
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.0,
              stops: [0, 100],
              colorStops: [
                {
                  offset: 0,
                  color: loading ? 'gray' : theme.primary1,
                  opacity: 0.7,
                },
                {
                  offset: 100,
                  color: loading ? 'gray' : theme.primary1,
                  opacity: 0,
                },
              ],
            },
          },
        }}
        height={250}
        series={[
          {
            name: 'Balance',
            data: data,
          },
        ]}
      ></ReactApexChart>
    </AccountBalanceChartWrapper>
  );
}
