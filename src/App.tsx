import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";
import axios from "axios";
import { ViewSelector } from "./components/ViewSelector";
import { StickChart } from "./components/StickChart";
import { TimeSeriesData, ViewMode, ChartData } from "./types";
import { formatDate, parseDate } from "./utils/dateUtils";

function App() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(
    null
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>("daily");

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data: TimeSeriesData = response.data;
      setTimeSeriesData(data);
      updateChartData(data, activeView);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (data: TimeSeriesData, view: ViewMode) => {
    let historicalData: { [key: string]: number };

    switch (view) {
      case "monthly":
        historicalData = data.monthlyData;
        break;
      case "yearly":
        historicalData = data.yearlyData;
        break;
      default:
        historicalData = data.dailyData;
    }

    const lastDate = new Date(data.lastDate);
    const formattedData: ChartData[] = [];

    Object.entries(historicalData)
      .sort(
        ([dateA], [dateB]) =>
          parseDate(dateA).getTime() - parseDate(dateB).getTime()
      )
      .forEach(([date, value]) => {
        const currentDate = parseDate(date);
        const timestamp = currentDate.getTime();

        if (currentDate < lastDate) {
          formattedData.push({
            date,
            timestamp,
            displayDate: formatDate(currentDate, view),
            historical: value,
          });
        } else {
          formattedData.push({
            date,
            timestamp,
            displayDate: formatDate(currentDate, view),
            predicted: value,
          });
        }
      });

    setChartData(formattedData);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeSeriesData) {
      updateChartData(timeSeriesData, activeView);
    }
  }, [activeView, timeSeriesData]);

  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          {payload.map((entry, index) => (
            <>
              <p>{entry.payload.displayDate}</p>
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: ${entry.value.toLocaleString()}
              </p>
            </>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTimeAxisTicks = () => {
    if (!chartData.length) return [];

    const interval =
      activeView === "daily" ? 7 : activeView === "monthly" ? 1 : 3;

    return chartData
      .filter((_, index) => index % interval === 0)
      .map((d) => d.timestamp);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <TrendingUp className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Time Series Analysis
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Historical Data and Predictions
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 p-4 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <ViewSelector
                activeView={activeView}
                onViewChange={handleViewChange}
              />
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>

            {activeView === "yearly" ? (
              <StickChart
                data={chartData}
                transitionDate={timeSeriesData?.lastDate || ""}
              />
            ) : (
              <div className="w-full overflow-x-auto">
                <LineChart
                  width={1200}
                  height={500}
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(timestamp) => {
                      const date = new Date(timestamp);
                      return formatDate(date, activeView);
                    }}
                    ticks={getTimeAxisTicks()}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(value)
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {timeSeriesData && (
                    <ReferenceLine
                      x={new Date(timeSeriesData.lastDate).getTime()}
                      stroke="#888"
                      strokeDasharray="3 3"
                      label={{
                        value: "Transition Point",
                        position: "top",
                        fill: "#888",
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="historical"
                    name="Historical Data"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 6 }}
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted Data"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 1 }}
                    activeDot={{ r: 6 }}
                    connectNulls={true}
                  />
                </LineChart>
              </div>
            )}
          </div>

          {/* Prediction Analysis Section */}
          {/* {timeSeriesData && (
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Prediction Analysis Report
              </h2>
              <PredictionAnalysis timeSeriesData={timeSeriesData} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default App;
