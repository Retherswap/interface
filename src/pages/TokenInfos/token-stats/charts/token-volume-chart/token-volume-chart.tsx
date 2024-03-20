import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from 'utils/formatNumber';
import { useIsDarkMode } from 'state/user/hooks';
import barChartSkeletonData from 'components/Skeleton/bar-chart-skeleton-data';
import { Token } from 'models/schema';

export default function TokenVolumeChart({ token }: { token?: Token }) {
  const isDarkMode = useIsDarkMode();
  const [isLoading, setLoading] = useState(true);
  const volumeData = useMemo(() => {
    if (!token || !token.volume) {
      return barChartSkeletonData;
    }
    const volumeData: { [date: number]: number } = {};
    for (const volume of token.volume) {
      const date = new Date(volume.date);
      date.setHours(0, 0, 0, 0);
      if (!volumeData[date.getTime()]) {
        volumeData[date.getTime()] = 0;
      }
      volumeData[date.getTime()] += Number(volume.usdVolume);
    }
    setLoading(false);
    return volumeData;
  }, [token]);

  return (
    <ReactApexChart
      type="bar"
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
          categories: Object.keys(volumeData).map((date) => new Date(Number(date)).toLocaleDateString()),
          labels: {
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
        fill: isLoading
          ? {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
                colorStops: [
                  {
                    offset: 0,
                    color: 'gray',
                    opacity: 0.5,
                  },
                  {
                    offset: 100,
                    color: 'gray',
                    opacity: 1,
                  },
                ],
              },
            }
          : {},
        dataLabels: {
          enabled: false,
        },
        grid: { show: false },
        tooltip: {
          enabled: !isLoading,
          style: {
            fontFamily: 'Roboto, sans-serif !important',
          },
        },
      }}
      height="100%"
      series={[
        {
          name: 'Volume',
          data: Object.entries(volumeData).map(([date, volume]) => {
            return volume;
          }),
        },
      ]}
    ></ReactApexChart>
  );
}
