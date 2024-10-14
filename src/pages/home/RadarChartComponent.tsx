import { useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { RadarChartData, RadarChartOptions } from '../../common/constants';

// Register necessary components for Radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Define types for the data coming from the API
interface ActivityData {
  label: string;
  percentage: number;
}

// Define the shape of the chart's dataset
interface RadarChartDataset {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
  }[];
}

interface RadarChartComponentProps {
  graph: ActivityData[];
}

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ graph }) => {
  const chartRef = useRef<any>(null);

  // Initial Radar chart data shape with typing
  const [radarChartData, setRadarChartData] = useState<RadarChartDataset>(RadarChartData);
  const [isLoading, setIsLoading] = useState(true);
  const [highestLabel, setHighestLabel] = useState<string>('');
  const [highestValue, setHighestValue] = useState<number>(-1);
  const [highestValueIndex, setHighestValueIndex] = useState<number>(-1);

  // Update chart data state with new labels and data from props
  useEffect(() => {
    if (graph && graph.length > 0) {
      setRadarChartData((prevState) => ({
        ...prevState,
        labels: graph.map((item) => item.label),
        datasets: [
          {
            ...prevState.datasets[0],
            data: graph.map((item) => Math.round(item.percentage)),
          },
        ],
      }));
      setIsLoading(false);
    }
  }, [graph]);

  // Calculating highest contributor category
  useEffect(() => {
    if (!isLoading) {
      const index = radarChartData.datasets[0].data.indexOf(Math.max(...radarChartData.datasets[0].data));
      setHighestValueIndex(index);
      setHighestValue(radarChartData.datasets[0].data[index]);
      setHighestLabel(radarChartData.labels[index]);
    }
  }, [radarChartData, isLoading]);

  return (
    <div className="h-full w-full flex flex-col items-center gap-2">
      {/* Original Chart */}
      <div className="flex-1 flex justify-center items-center">
        {isLoading && (
          <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        )}
        {!isLoading && (
          <Radar
            ref={chartRef}
            data={radarChartData}
            options={RadarChartOptions}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </div>

      {/* Max Contribution Banner */}
      <div className="w-full bg-gray-blue-800 min-h-9 rounded-lg px-4 py-2 flex items-center gap-2">
        <div className="size-3 rounded-full bg-white shrink-0"></div>
        <div className="font-normal text-gray-blue-25 text-xs">
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <span className="font-bold">{highestValue !== -1 ? highestValue + '%' : 'N/A'} </span>
              of your data quality is from
              <span className="font-bold"> {highestLabel || 'N/A'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
