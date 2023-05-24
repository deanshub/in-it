'use client';
import { ResponsiveLine } from '@nivo/line';
import { useMemo } from 'react';

export function LineChart() {
  const data = useMemo(
    () => [
      {
        id: 'app1.js',
        color: 'hsl(51, 70%, 50%)',
        data: [
          {
            x: '1.0.0',
            y: 184,
          },
          {
            x: '1.0.1',
            y: 31,
          },
          {
            x: '1.0.2',
            y: 179,
          },
          {
            x: '1.0.3',
            y: 170,
          },
          {
            x: '2.0.0',
            y: 9,
          },
          {
            x: '2.0.1',
            y: 185,
          },
          {
            x: '2.0.2',
            y: 198,
          },
          {
            x: '2.0.3',
            y: 145,
          },
          {
            x: '2.0.4',
            y: 110,
          },
          {
            x: '2.0.5',
            y: 271,
          },
          {
            x: '2.0.6',
            y: 42,
          },
          {
            x: '2.0.7',
            y: 114,
          },
        ],
      },
      {
        id: 'app2.js',
        color: 'hsl(165, 70%, 50%)',
        data: [
          {
            x: '1.0.0',
            y: 45,
          },
          {
            x: '1.0.1',
            y: 257,
          },
          {
            x: '1.0.2',
            y: 185,
          },
          {
            x: '1.0.3',
            y: 29,
          },
          {
            x: '2.0.0',
            y: 285,
          },
          {
            x: '2.0.1',
            y: 3,
          },
          {
            x: '2.0.2',
            y: 208,
          },
          {
            x: '2.0.3',
            y: 181,
          },
          {
            x: '2.0.4',
            y: 226,
          },
          {
            x: '2.0.5',
            y: 282,
          },
          {
            x: '2.0.6',
            y: 84,
          },
          {
            x: '2.0.7',
            y: 205,
          },
        ],
      },
    ],
    [],
  );
  return (
    // @ts-expect-error-next-line
    <ResponsiveLine
      data={data}
      colors={{ scheme: 'pastel1' }}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: '#f2f2f2',
            },
          },
          legend: {
            text: {
              fill: '#f2f2f2',
            },
          },
        },
        legends: {
          text: {
            fill: '#f2f2f2',
          },
        },
      }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}
