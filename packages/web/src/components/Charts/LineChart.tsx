'use client';
import { ResponsiveLine, type Serie } from '@nivo/line';
import { format, isToday } from 'date-fns';
import filesize from 'filesize';

interface LineChartProps {
  data: Serie[];
}

export function LineChart({ data }: LineChartProps) {
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
      margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'time', format: '%Y-%m-%d' }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'point',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Date',
        legendOffset: 36,
        legendPosition: 'middle',
        format: (value: Date) => {
          if (isToday(value)) {
            return format(value, 'HH:mm');
          }

          return format(value, 'yyyy-MM-dd HH:mm');
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Count',
        legendOffset: -40,
        legendPosition: 'middle',
        format: (value: number) => {
          return filesize(value);
        },
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
