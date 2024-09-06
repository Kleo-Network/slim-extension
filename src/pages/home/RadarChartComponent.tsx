import { useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Mock_Chart_Response, RadarChartData, RadarChartOptions } from '../../common/constants';

// Register necessary components for Radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const RadarChartComponent = () => {
  const chartRef = useRef<any>(null);

  // State to hold the radar chart data
  const [radarChartData, setRadarChartData] = useState(RadarChartData);
  const [isLoading, setIsLoading] = useState(true);
  const [highestLabel, setHighestLabel] = useState('');
  const [highestValue, setHighestValue] = useState(-1);
  const [highestValueIndex, setHighestValueIndex] = useState(-1);

  // Simulating API call with mock data
  // TODO: Replace this with actual API call
  useEffect(() => {
    setTimeout(() => {
      // Update chart data state with new labels and data from API
      setRadarChartData((prevState) => ({
        ...prevState,
        labels: Mock_Chart_Response.map((item) => item.label),
        datasets: [
          {
            ...prevState.datasets[0],
            data: Mock_Chart_Response.map((item) => parseInt(item.percentage)),
          },
        ],
      }));
      setIsLoading(false);
    }, 1000); // Simulate delay for API response
  }, []);

  // Calculating Highest contributor category.
  useEffect(() => {
    if (!isLoading) {
      const index = radarChartData.datasets[0].data.indexOf(Math.max(...radarChartData.datasets[0].data));
      setHighestValueIndex(index);
      setHighestValue(radarChartData.datasets[0].data[index]);
      setHighestLabel(radarChartData.labels[index]);
    }
  }, [radarChartData, isLoading]);

  return (
    <div className="h-full w-full flex flex-col items-center gap-4">
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
            style={{ height: '100%', width: '100%' }} // Make canvas cover entire div
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
              <span className="font-bold">{highestValue ? highestValue + '%' : 'N/A'} </span>
              of your data quality is from
              <span className="font-bold"> {highestLabel ? highestLabel : 'N/A'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
