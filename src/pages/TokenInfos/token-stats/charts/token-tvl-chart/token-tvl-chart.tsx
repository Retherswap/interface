import { TokenModel } from 'models/TokenModel';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from 'utils/formatNumber';
import { useIsDarkMode } from 'state/user/hooks';

export default function TokenTVLChart({ token }: { token: TokenModel }) {
  const isDarkMode = useIsDarkMode();
  const state = {
    series: [
      {
        name: 'TVL',
        data: token.tvl
          .map((tvl) => {
            return {
              x: new Date(tvl.date),
              y: tvl.reserveUsd,
            };
          })
          .sort((a, b) => (a.x.getTime() > b.x.getTime() ? 1 : -1)),
      },
    ],
  };

  return (
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
          opposite: true,
          labels: {
            formatter: (value) => {
              if (value >= 1) {
                return formatNumber(value);
              }
              let formattedPrice = value.toString();
              let index = formattedPrice.indexOf('.') + 1;
              while (
                index < formattedPrice.length &&
                (formattedPrice[index] === '0' || index < formattedPrice.indexOf('.') + 1)
              ) {
                ++index;
              }
              formattedPrice = formattedPrice.slice(0, index + 2);
              return `$${formattedPrice}`;
            },
          },
        },
        xaxis: {
          labels: {
            formatter: (value) => {
              return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
            },
            show: false,
          },
          tooltip: {
            enabled: false,
          },
          axisBorder: {
            show: false, // Cacher la bordure de l'axe X
          },
          axisTicks: {
            show: false, // Cacher les ticks de l'axe X
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: { show: false },
        tooltip: {
          style: {
            fontFamily: 'Roboto, sans-serif !important',
          },
        },
      }}
      height="100%"
      series={state.series}
    ></ReactApexChart>
  );
}
