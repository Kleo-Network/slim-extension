// RadarChartComponent.tsx
import { useEffect, useRef, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { RadarChartData, RadarChartOptions } from "../common/constants";

// Register necessary components for Radar chart
ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

const mockLabels = [
	"Eating",
	"Drinking",
	"Sleeping",
	"Designing",
	"Coding",
	"Cycling",
	"Running",
	"Coding",
	"Cycling",
	"Running",
];
const mockValues = [35, 70, 55, 80, 60, 45, 90, 60, 45, 90.34];

export const RadarChartComponent = () => {
	const chartRef = useRef<any>(null);

	// State to hold the radar chart data
	const [radarChartData, setRadarChartData] = useState(RadarChartData);
	const [isLoading, setIsLoading] = useState(true);
	const [highestLabel, setHighestLabel] = useState("");
	const [highestValue, setHighestValue] = useState(-1);
	const [highestValueIndex, setHighestValueIndex] = useState(-1);

	useEffect(() => {
		// Simulating API call with mock data
		// TODO: Replace this with actual API call
		setTimeout(() => {
			// Update chart data state with new labels and data from API
			setRadarChartData((prevState) => ({
				...prevState,
				labels: mockLabels,
				datasets: [
					{
						...prevState.datasets[0],
						data: mockValues,
					},
				],
			}));
			setIsLoading(false);
		}, 1000); // Simulate delay for API response
	}, []);

	useEffect(() => {
		if (!isLoading) {
			const index = radarChartData.datasets[0].data.indexOf(
				Math.max(...radarChartData.datasets[0].data)
			);
			setHighestValueIndex(index);
			setHighestValue(radarChartData.datasets[0].data[index]);
			setHighestLabel(radarChartData.labels[index]);
		}
	}, [radarChartData, isLoading]);

	return (
		<div className="h-[270px] w-[367px] rounded-lg flex flex-col justify-between items-center bg-primary-btn-100/20">
			<div className="flex flex-col justify-center items-center py-1 px-4 text-sm font-medium rounded-lg rounded-b-none text-secondary">
				<div className="" style={{ width: "inherit" }}>
					Activity Chart
				</div>
				<div className="text-xs font-normal">
					{isLoading
						? "Loading..."
						: `${highestLabel ? highestLabel : "N/A"} contributes ${
								highestValue ? highestValue : "N/A"
						  } to your Rank.`}
				</div>
			</div>
			<div className="flex-1 flex justify-center items-center">
				{isLoading && (
					<div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
				)}
				{!isLoading && (
					<Radar
						ref={chartRef}
						data={radarChartData}
						options={RadarChartOptions}
						style={{ height: "100%", width: "100%" }} // Make canvas cover entire div
					/>
				)}
			</div>
		</div>
	);
};
