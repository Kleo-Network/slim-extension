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
			display: false, // Hide the legend
		},
		point: {
			radius: "10",
			hoverRadius: 10,
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
