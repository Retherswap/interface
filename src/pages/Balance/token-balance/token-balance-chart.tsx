import React, { useMemo, useState } from 'react';
import { formatNumber } from 'utils/formatNumber';
import ReactApexChart from 'react-apexcharts';
import { useIsDarkMode } from 'state/user/hooks';
import useTheme from 'hooks/useTheme';
import styled from 'styled-components';
import { Balance } from 'models/schema';
import { useNativeToken } from 'hooks/useNativeToken';
import areaChartSkeletonData from 'components/Skeleton/area-chart-skeleton-data';

const AccountBalanceChartWrapper = styled.div`
  width: calc(100% + 10px);
  margin-left: -8px;
`;

export default function TokenBalanceChart({ balance }: { balance?: Balance }) {
  const [data, setData] = useState<any[]>(areaChartSkeletonData);
  const [loading, setLoading] = useState(true);
  const { nativeToken } = useNativeToken();
  useMemo(() => {
    if (!nativeToken) return;
    if (!balance || !balance.balanceChanges || balance.balanceChanges.length === 0) return;
    if (!balance.token.price || balance.token.price.length === 0) return;
    const balanceChanges = balance.balanceChanges.map((balanceChange) => {
      return { time: new Date(balanceChange.date).getTime(), balanceChange: balanceChange };
    });
    balanceChanges.sort((a, b) => {
      return a.time - b.time;
    });
    const findNearestBalanceChange = (date: Date) => {
      let start = 0;
      let end = balanceChanges.length - 1;
      let max = 0;
      while (start <= end && max < 10) {
        let mid = Math.floor((start + end) / 2);
        if (balanceChanges[mid].time === date.getTime()) {
          return balanceChanges[mid];
        } else if (balanceChanges[mid].time < date.getTime()) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
        ++max;
      }
      if (start >= balanceChanges.length) return balanceChanges[balanceChanges.length - 1];
      if (end < 0) return balanceChanges[0];
      const distStart = Math.abs(balanceChanges[start].time - date.getTime());
      const distEnd = Math.abs(date.getTime() - balanceChanges[end].time);
      return distStart < distEnd ? balanceChanges[start] : balanceChanges[end];
    };
    setData(
      balance.token.price
        .map((price) => {
          const balanceChange = findNearestBalanceChange(new Date(price.date));
          return {
            x: new Date(price.date).getTime(),
            y: (Number(balanceChange.balanceChange.amount) * Number(price.closeUsd)).toFixed(),
            amount: Number(balanceChange.balanceChange.amount),
            price: Number(price.closeUsd),
          };
        })
        .sort((a, b) => {
          return a.x - b.x;
        })
    );
    setLoading(false);
  }, [balance, nativeToken]);
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();
  return (
    <AccountBalanceChartWrapper>
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
                return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
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
          tooltip: {
            enabled: !loading,
            style: {
              fontFamily: 'Roboto, sans-serif !important',
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const value = series[seriesIndex][dataPointIndex];
              const date = new Date(w.config.series[seriesIndex].data[dataPointIndex].x);
              return `        
              <div>
                <div class="apexcharts-tooltip-title" style="font-size: 12px;">${date.toLocaleString()}</div>
                <div class="apexcharts-tooltip-series-group" style="display: flex; flex-direction: column; align-items: start">
                  <div class="apexcharts-tooltip-text" style="margin-right: 5px;">$ ${formatNumber(value)}</div>
                  <div class="apexcharts-tooltip-text" style="margin-right: 5px;">
                    Price: ${formatNumber(w.config.series[seriesIndex].data[dataPointIndex].price)}
                  </div>
                  <div class="apexcharts-tooltip-text" style="margin-right: 5px;">
                    Balance: ${formatNumber(w.config.series[seriesIndex].data[dataPointIndex].amount)}
                  </div>
                </div>
              </div>`;
            },
          },
          grid: {
            show: false,
            padding: {
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
        //style={{ marginLeft: '-12px', width: 'calc(100% + 32px)' }}
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
