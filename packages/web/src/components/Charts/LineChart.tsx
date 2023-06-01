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
        tooltip: {
          container: {
            background: '#333',
          },
        },
      }}
      onMouseEnter={(point) => {
        const buildId = (point.data as any as { id: string }).id;
        document.querySelectorAll('#buildsTableBody>tr').forEach((row) => {
          row.classList.remove('bg-gray-800');
        });
        document.getElementById(buildId)?.classList.add('bg-gray-800');
      }}
      onMouseMove={(point) => {
        const buildId = (point.data as any as { id: string }).id;
        document.querySelectorAll('#buildsTableBody>tr').forEach((row) => {
          row.classList.remove('bg-gray-800');
        });
        document.getElementById(buildId)?.classList.add('bg-gray-800');
      }}
      onMouseLeave={() => {
        document.querySelectorAll('#buildsTableBody>tr').forEach((row) => {
          row.classList.remove('bg-gray-800');
        });
      }}
      onClick={(point) => {
        const buildId = (point.data as any as { id: string }).id;
        const buildRow = document.getElementById(buildId);
        buildRow?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        buildRow?.classList.add('animate-[pulse_1s_ease-in-out_2]');
      }}
      margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
      tooltip={({ point }) => {
        return (
          <div className="bg-gray-800 p-2 rounded-md flex flex-col justify-center items-center">
            <div className="text-gray-300 flex gap-2 items-center">
              <span
                style={{ backgroundColor: point.serieColor }}
                className="rounded-full w-4 h-4"
              />
              <span>{filesize(point.data.y as number)}</span>
            </div>
            <div className="text-gray-300">{format(point.data.x as Date, 'yyyy-MM-dd HH:mm')}</div>
          </div>
        );
      }}
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
