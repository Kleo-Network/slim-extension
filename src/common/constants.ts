export const REDIRECT_TO_DASHBOARD_URL = `https://www.app.kleo.network/profileV2/{slug}`;

export const KLEO_XP = 'KLEO XP';
export const ACTIVITY_GRAPH_TITLE = 'Activity Graph';
export const SHARE_ON_X = 'Share on X';

export const MOCK_USER = {
  badges: [],
  content_tags: [],
  first_time_user: false,
  identity_tags: [],
  kleo_points: 1234,
  data_quality: 87,
  slug: '0x573aFF24788A7c28dE5E94C945e7b46a6f16f7C1',
  verified: false,
  last_minted: 1722523989,
  total_data_quantity: 34, // this would be in MegaBytes, this is 34MB
};

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
        display: true,
        color: 'rgb(208, 213, 221)', // Graying border color
        lineWidth: 0.8,
      },
      grid: {
        color: 'rgb(208, 213, 221)',
        circular: true,
        lineWidth: 0.8,
      },
      pointLabels: {
        color: 'rgba(29, 41, 57, 1)', // White labels
        font: {
          size: 10,
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
      radius: '10',
      hoverRadius: 10,
    },
  },
};

export const RadarChartData = {
  labels: ['Math', 'Science'],
  datasets: [
    {
      data: [20, 30],
      backgroundColor: 'rgba(127, 86, 217, 0.1)', // white background
      borderColor: 'rgba(127, 86, 217, 1)', // White border line
      borderWidth: 0.8,
      pointBackgroundColor: 'rgba(127, 86, 217, 1)', // White points
      pointBorderColor: 'rgba(127, 86, 217, 1)', // White point border
      pointHoverBackgroundColor: 'rgba(107,33,168, 1)', // White point hover background
      pointHoverBorderColor: 'rgba(107,33,168, 1)', // White point hover border
    },
  ],
};
