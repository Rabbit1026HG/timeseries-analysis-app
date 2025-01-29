import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp as ArrowTrendingUp, TrendingDown as ArrowTrendingDown, Target } from 'lucide-react';
import { TimeSeriesData } from '../types';

interface PredictionAnalysisProps {
  timeSeriesData: TimeSeriesData;
}

interface AnalysisMetrics {
  mean: number;
  max: number;
  min: number;
  stdDev: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

const calculateMetrics = (data: number[]): AnalysisMetrics => {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstHalfMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondHalfMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const trend = secondHalfMean > firstHalfMean * 1.05 ? 'up' : 
                secondHalfMean < firstHalfMean * 0.95 ? 'down' : 'stable';
  
  // Calculate confidence based on standard deviation relative to mean
  const confidence = Math.max(0, Math.min(100, 100 * (1 - stdDev / mean)));

  return { mean, max, min, stdDev, trend, confidence };
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const PredictionAnalysis: React.FC<PredictionAnalysisProps> = ({ timeSeriesData }) => {
  const predictionValues = Object.values(timeSeriesData.predictions);
  const metrics = calculateMetrics(predictionValues);
  
  const trendData = Object.entries(timeSeriesData.predictions).map(([date, value]) => ({
    date,
    value,
    average: metrics.mean,
    upperBound: metrics.mean + metrics.stdDev,
    lowerBound: metrics.mean - metrics.stdDev,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Analysis Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Average Analysis</h3>
            <ArrowTrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Mean Prediction</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.mean)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Standard Deviation</p>
              <p className="text-lg font-semibold text-gray-700">
                ±{formatCurrency(metrics.stdDev)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Confidence Level</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2" 
                    style={{ width: `${metrics.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(metrics.confidence)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Performance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Peak Performance</h3>
            <Target className="h-6 w-6 text-green-500" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Highest Prediction</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.max)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Above Average By</p>
              <p className="text-lg font-semibold text-gray-700">
                {formatCurrency(metrics.max - metrics.mean)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Performance Rating</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`h-2 w-8 rounded ${
                      i < Math.ceil((metrics.max - metrics.mean) / metrics.stdDev)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Areas Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Improvement Areas</h3>
            <ArrowTrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Lowest Prediction</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(metrics.min)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Below Average By</p>
              <p className="text-lg font-semibold text-gray-700">
                {formatCurrency(metrics.mean - metrics.min)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Volatility Index</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-red-500 rounded-full h-2" 
                    style={{ 
                      width: `${(metrics.stdDev / metrics.mean) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((metrics.stdDev / metrics.mean) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis</h3>
        <div className="w-full h-[300px]">
          <LineChart
            width={800}
            height={300}
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#9ca3af" 
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="upperBound" 
              stroke="#d1d5db" 
              strokeDasharray="3 3"
            />
            <Line 
              type="monotone" 
              dataKey="lowerBound" 
              stroke="#d1d5db" 
              strokeDasharray="3 3"
            />
          </LineChart>
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistical Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Analysis
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Mean
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(metrics.mean)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Average prediction value across the dataset
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Standard Deviation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(metrics.stdDev)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Measure of prediction volatility
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Trend
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`capitalize ${
                    metrics.trend === 'up' ? 'text-green-600' :
                    metrics.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metrics.trend}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Overall direction of predictions
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Confidence Level
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.round(metrics.confidence)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Statistical reliability of predictions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};