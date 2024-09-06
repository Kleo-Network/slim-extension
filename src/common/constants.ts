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
        display: false,
      },
      grid: {
        color: 'rgba(216, 180, 254, 1)', // White grid lines
        circular: true,
        lineWidth: 2,
      },
      pointLabels: {
        color: 'rgba(107, 33, 168, 1)', // White labels
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
      backgroundColor: 'rgba(127, 86, 217, 0.2)', // Light pink background
      borderColor: 'rgba(127, 86, 217, 1)', // White border line
      pointBackgroundColor: 'rgba(147, 51, 234, 0.7)', // White points
      pointBorderColor: 'rgba(147, 51, 234, 1)', // White point border
      pointHoverBackgroundColor: 'rgba(147, 51, 234, 1)', // White point hover background
      pointHoverBorderColor: 'rgba(147, 51, 234, 1)', // White point hover border
    },
  ],
};
