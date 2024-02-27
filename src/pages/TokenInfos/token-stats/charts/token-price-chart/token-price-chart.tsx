import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from 'utils/formatNumber';
import { useIsDarkMode } from 'state/user/hooks';

export default function TokenPriceChart({ token }: { token: TokenModel }) {
  const isDarkMode = useIsDarkMode();
  const prices = [];
  for (let i = 0; i < token.price.length; ++i) {
    const open = token.price[i].usdPrice;
    const close = i > 0 ? token.price[i - 1].usdPrice : open;
    const high = Math.max(open, close);
    const low = Math.min(open, close);
    prices.push({ x: new Date(token.price[i].date), y: [open, high, low, close] });
  }
  const state = {
    series: [
      {
        name: 'Price',
        data: prices.sort((a, b) => (a.x.getTime() > b.x.getTime() ? 1 : -1)),
      },
    ],
  };

  return (
    <ReactApexChart
      type="candlestick"
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
              return '$' + formatNumber(value);
            },
          },
        },
        xaxis: {
          labels: {
            show: false,
            formatter: (value) => {
              return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
            },
          },
          axisBorder: {
            show: false, // Cacher la bordure de l'axe X
          },
          axisTicks: {
            show: false, // Cacher les ticks de l'axe X
          },
          tooltip: {
            enabled: false,
          },
        },
        grid: { show: false },
        tooltip: {
          custom: function ({ seriesIndex, dataPointIndex, w }) {
            const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
            const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
            const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
            const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
            const change = ((c - o) / o) * 100;
            const date = w.globals.categoryLabels[dataPointIndex];
            return `<div>
              <div class="header"><span>${date}</span></div>
              <div>change: <span class="value">${change.toFixed(2)}%</span></div>
              <div>Close: <span class="value">$${formatNumber(c)}</span></div>
            </div>`;
          },
        },
      }}
      height="100%"
      series={state.series}
    ></ReactApexChart>
  );
}
