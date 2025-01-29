import React from 'react';
import { ChartData } from '../types';

interface StickChartProps {
  data: ChartData[];
  transitionDate: string;
}

export const StickChart: React.FC<StickChartProps> = ({ data, transitionDate }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.historical || 0, d.predicted || 0)));
  const chartHeight = 300;
  const barWidth = 40;
  const gap = 20;
  const chartWidth = (barWidth + gap) * data.length;

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full overflow-x-auto flex justify-center p-4">
      <div style={{ width: chartWidth, minHeight: chartHeight + 100 }} className="relative">
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <div
            key={ratio}
            className="absolute w-full border-t border-gray-200 "
            style={{
              bottom: `${30+ratio * chartHeight}px`,
            }}
          >
            <span className="absolute -left-16 -translate-y-3 text-sm text-gray-500">
              {formatValue(maxValue * ratio)}
            </span>
          </div>
        ))}

        {/* Bars */}
        <div className="absolute left-0 flex items-end" style={{ bottom: "30px" }}>
          {data.map((item) => {
            const value = item.historical || item.predicted || 0;
            const height = (value / maxValue) * chartHeight;
            const isPredicted = new Date(item.date) >= new Date(transitionDate);

            return (
              <div
                key={item.date}
                className="flex flex-col items-center"
                style={{ width: barWidth + gap }}
              >
                <div
                  className={`w-full transition-all duration-500 transform bottom-0 absolute  ${
                    isPredicted ? 'bg-red-500' : 'bg-indigo-600'
                  }`}
                  style={{
                    height: `${height}px`,
                    marginLeft: gap / 2,
                    width: barWidth,
                  }}
                >
                  <div className="opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-75 text-white p-2 rounded absolute -translate-y-full text-center whitespace-nowrap">
                    {formatValue(value)}
                  </div>
                </div>
                <div
                  className="mt-2 origin-left whitespace-nowrap text-sm   left-1/2 bottom-0  
                    text-gray-600"
                  style={{ marginLeft: gap / 2, transform: 'translateY(100%)' }}
                >
                  {item.displayDate}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition line */}
        {data.findIndex(item => item.date === transitionDate) !== -1 && (
          <div
            className="absolute bottom-0 border-l-2 border-gray-400 border-dashed h-full"
            style={{
              left: `${
                (data.findIndex(item => item.date === transitionDate) + 0.5) *
                (barWidth + gap)
              }px`,
            }}
          >
            <div className="absolute top-0 -translate-x-1/2 bg-gray-100 px-2 py-1 rounded text-sm">
              Transition Point
            </div>
          </div>
        )}
      </div>
    </div>
  );
};