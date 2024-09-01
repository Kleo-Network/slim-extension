import { Align, Anchor } from "chartjs-plugin-datalabels/types/options";

export const RadarChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	layout: {
		padding: 20,
	},
	scales: {
		r: {
			beginAtZero: true,
			angleLines: {
				display: false,
			},
			grid: {
				color: "rgba(216, 180, 254, 1)", // White grid lines
				circular: true,
				lineWidth: 2,
			},
			pointLabels: {
				color: "rgba(107, 33, 168, 1)", // White labels
				font: {
					size: 12,
				},
			},
			ticks: {
				display: false, // Hide numerical ticks
			},
		},
	},
	plugins: {
		legend: {
			display: false,
		},
		// Show Values at the point itself.
		datalabels: {
			display: true, // Enable datalabels plugin to display values
			color: "rgba(107, 33, 168, 1)", // Custom color for the data labels
			font: {
				size: 10,
			},
			anchor: "end" as Anchor, // Position label relative to the point
			align: "start" as Align, // Align the label above the point
			offset: 5, // Adds a small gap between the point and the label
			formatter: (value: number) => value.toFixed(0), // Formatter to display the value without decimals
		},
	},
};

export const RadarChartData = {
	labels: ["Math", "Science"],
	datasets: [
		{
			data: [20, 30],
			backgroundColor: "rgba(127, 86, 217, 0.2)", // Light pink background
			borderColor: "rgba(127, 86, 217, 1)", // White border line
			pointBackgroundColor: "rgba(147, 51, 234, 0.7)", // White points
			pointBorderColor: "rgba(147, 51, 234, 1)", // White point border
			pointHoverBackgroundColor: "rgba(147, 51, 234, 1)", // White point hover background
			pointHoverBorderColor: "rgba(147, 51, 234, 1)", // White point hover border
		},
	],
};
