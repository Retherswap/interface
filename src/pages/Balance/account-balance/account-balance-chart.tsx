import React from 'react';
import { formatNumber } from 'utils/formatNumber';
import ReactApexChart from 'react-apexcharts';
import { useIsDarkMode } from 'state/user/hooks';
import useTheme from 'hooks/useTheme';
import styled from 'styled-components';

const AccountBalanceChartWrapper = styled.div`
  cursor: pointer;
  width: calc(100% + 10px);
  margin-left: -8px;
  transition: filter 0.25s;
  &:hover {
    filter: drop-shadow(0 0 10px ${({ theme }) => theme.primary1});
  }
`;

export default function AccountBalanceChart() {
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
            min: function (min) {
              return min - 10;
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
            colors: [theme.primary1],
            width: 2,
          },
          tooltip: {
            enabled: false,
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
                  color: theme.primary1,
                  opacity: 0.7,
                },
                {
                  offset: 100,
                  color: theme.primary1,
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
            data: [
              { x: new Date(1538778600000), y: 6633.33 },
              { x: new Date(1538782200000), y: 6623.45 },
              { x: new Date(1538785800000), y: 6623.48 },
              { x: new Date(1538789400000), y: 6615.17 },
              { x: new Date(1538793000000), y: 6620.02 },
              { x: new Date(1538796600000), y: 6618.43 },
              { x: new Date(1538800200000), y: 6615.97 },
              { x: new Date(1538803800000), y: 6615.43 },
              { x: new Date(1538807400000), y: 6611.41 },
              { x: new Date(1538811000000), y: 6610.32 },
              { x: new Date(1538814600000), y: 6625.5 },
              { x: new Date(1538818200000), y: 6623.91 },
              { x: new Date(1538821800000), y: 6628.69 },
              { x: new Date(1538825400000), y: 6628.92 },
              {
                x: new Date(1538829000000),
                y: 6635.21,
              },
            ],
          },
        ]}
      ></ReactApexChart>
    </AccountBalanceChartWrapper>
  );
}
