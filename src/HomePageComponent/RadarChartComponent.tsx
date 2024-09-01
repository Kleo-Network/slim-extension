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
];
const mockValues = [28, 48, 40, 19, 96, 27, 100];

export const RadarChartComponent = () => {
	const chartRef = useRef<any>(null);

	// State to hold the radar chart data
	const [radarChartData, setRadarChartData] = useState(RadarChartData);
	const [isLoading, setIsLoading] = useState(true);

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

	return (
		<div className="h-[270px] w-[367px] rounded-lg flex justify-center items-center bg-primary-btn-100/20">
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
	);
};
