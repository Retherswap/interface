import { TokenModel } from 'models/TokenModel';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { formatNumber } from 'utils/formatNumber';
import { useIsDarkMode } from 'state/user/hooks';

export default function TokenPriceChart({ token }: { token: TokenModel }) {
  const isDarkMode = useIsDarkMode();
  /*const hourPrices: { [date: number]: { min: number; max: number } } = {};
  for (const price of token.price) {
    const date = new Date(price.date);
    date.setHours(0, 0, 0, 0);
    if (!hourPrices[date.getTime()]) {
      hourPrices[date.getTime()] = {
        min: price.usdPrice,
        max: price.usdPrice,
      };
    } else {
      hourPrices[date.getTime()].min = Math.min(hourPrices[date.getTime()].min, price.usdPrice);
      hourPrices[date.getTime()].max = Math.max(hourPrices[date.getTime()].max, price.usdPrice);
    }
  }*/
  const state = {
    series: [
      {
        name: 'Price',
        data: token.price
          .map((price) => {
            return { x: new Date(price.date), y: [price.openUsd, price.highUsd, price.lowUsd, price.closeUsd] };
          })
          .sort((a, b) => (a.x.getTime() > b.x.getTime() ? 1 : -1)),
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
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        grid: { show: false },
        tooltip: {
          custom: function ({ seriesIndex, dataPointIndex, w }) {
            const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
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