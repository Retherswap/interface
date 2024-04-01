import React, { useEffect, useState } from 'react';
import { formatNumber } from 'utils/formatNumber';
import ReactApexChart from 'react-apexcharts';
import { useIsDarkMode } from 'state/user/hooks';
import useTheme from 'hooks/useTheme';
import styled from 'styled-components';
import { Balance } from 'models/schema';
import areaChartSkeletonData from 'components/Skeleton/area-chart-skeleton-data';
import { apiUrl } from 'configs/server';
import { useActiveWeb3React } from 'hooks';

const AccountBalanceChartWrapper = styled.div`
  width: calc(100% + 10px);
  margin-left: -8px;
`;

export default function TokenBalanceChart({ balance }: { balance?: Balance }) {
  const [chart, setChart] = useState<any[]>(areaChartSkeletonData);
  const [loading, setLoading] = useState(true);
  const web3 = useActiveWeb3React();
  useEffect(() => {
    if (!web3.account || !balance) {
      return;
    }
    const fetchInfo = () => {
      return fetch(`${apiUrl}/balances/address/${web3.account}/token/${balance.token.address.address}/chart`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          setChart(
            data.map((item, index) => {
              return {
                x: new Date(item.date).getTime(),
                y: (Number(item.amount) * Number(item.usd_quote)).toFixed(2),
                amount: Number(item.amount),
                price: Number(item.usd_quote),
              };
            })
          );
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [balance, web3]);
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
            data: chart,
          },
        ]}
      ></ReactApexChart>
    </AccountBalanceChartWrapper>
  );
}
