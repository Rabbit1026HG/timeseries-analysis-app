export interface TimeSeriesData {
  dailyData: { [key: string]: number };
  monthlyData: { [key: string]: number };
  yearlyData: { [key: string]: number };
  lastDate: string;
  status: string;
  predictions: { [key: string]: number };
}

export type ViewMode = 'daily' | 'monthly' | 'yearly';

export interface ChartData {
  date: string;
  timestamp: number;
  displayDate: string;
  historical?: number;
  predicted?: number;
}