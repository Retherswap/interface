import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from 'utils/formatNumber';
import { useIsDarkMode } from 'state/user/hooks';

export default function TokenVolumeChart({ token }: { token: TokenModel }) {
  const isDarkMode = useIsDarkMode();
  const volumeData: { [date: number]: number } = {};
  for (const volume of token.volume) {
    const date = new Date(volume.date);
    date.setHours(0, 0, 0, 0);
    if (!volumeData[date.getTime()]) {
      volumeData[date.getTime()] = 0;
    }
    volumeData[date.getTime()] += Number(volume.usdVolume);
  }
  const state = {
    series: [
      {
        name: 'Volume',
        data: Object.entries(volumeData)
          .sort((a, b) => (new Date(a[0]).getTime() > new Date(b[0]).getTime() ? 1 : -1))
          .map(([date, volume]) => {
            return volume;
          }),
      },
    ],
  };

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
          categories: Object.keys(volumeData)
            .map((date) => new Date(Number(date)).toLocaleDateString())
            .sort((a, b) => (new Date(a).getTime() > new Date(b).getTime() ? 1 : -1)),
          labels: {
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
