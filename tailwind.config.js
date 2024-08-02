/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"gray-lightest": "#f9fafb",
				"gray-subheader": "#98A2B3",
				"gray-border": "#F2F4F7",
				"primary-btn": {
					100: "#D8B4FE",
					200: "#C084F5",
					300: "#A855F7",
					400: "#9333EA",
					500: "#7F56D9", // Base Color
					600: "#6B21A8",
				},
			},
			fontFamily: {
				inter: ["inter", "sans-serif"], // Add Inter font
			},
		},
	},
	plugins: [],
};
