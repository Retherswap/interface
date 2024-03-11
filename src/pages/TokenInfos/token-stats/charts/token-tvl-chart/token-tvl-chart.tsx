import { TokenModel } from 'models/TokenModel';
import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from 'utils/formatNumber';
import { useIsDarkMode } from 'state/user/hooks';
import areaChartSkeletonData from 'components/Skeleton/area-chart-skeleton-data';
import useTheme from 'hooks/useTheme';

export default function TokenTVLChart({ token }: { token?: TokenModel }) {
  const isDarkMode = useIsDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const series = useMemo(() => {
    if (!token) {
      return [
        {
          name: 'TVL',
          data: areaChartSkeletonData.map((tvl) => {
            return {
              x: new Date(tvl.x),
              y: tvl.y,
            };
          }),
        },
      ];
    }
    setIsLoading(false);
    return [
      {
        name: 'TVL',
        data: token.tvl.map((tvl) => {
          return {
            x: new Date(tvl.date),
            y: tvl.reserveUsd,
          };
        }),
      },
    ];
  }, [token, setIsLoading]);
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
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        stroke: {
          curve: 'straight',
          lineCap: 'square',
          colors: [isLoading ? 'gray' : theme.primary1],
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
                color: isLoading ? 'gray' : theme.primary1,
                opacity: 0.7,
              },
              {
                offset: 100,
                color: isLoading ? 'gray' : theme.primary1,
                opacity: 0,
              },
            ],
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
      series={series}
    ></ReactApexChart>
  );
}
