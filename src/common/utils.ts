export function capitalizeWords(input: string): string {
	return input
		.split(" ") // Split the string into words
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		) // Capitalize first letter and lower the rest
		.join(" "); // Join the words back into a single string
}

export function convertEpochToISO(epoch: number): string {
	const date = new Date(epoch * 1000); // Convert seconds to milliseconds
	const isoString = date.toISOString(); // Get ISO 8601 string in UTC timezone
	return isoString;
}

export function formatDate(epoch: number): string {
	const date = new Date(epoch * 1000); // Convert epoch to milliseconds

	const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day
	const year = date.getFullYear();

	return `${day} ${new Date(epoch * 1000).toLocaleDateString("en-US", {
		month: "long",
	})} ${year}`;
}

export function parseUrl(url: string): string {
	try {
		// Ensure the URL starts with http:// or https://
		const formattedUrl =
			url.startsWith("http://") || url.startsWith("https://")
				? url
				: `http://${url}`;

		// Parse the URL
		const { hostname } = new URL(formattedUrl);
		const hostParts = hostname.split(".");
		const n = hostParts.length;

		// Determine the domain
		if (n < 2) return hostname; // If there are less than 2 parts, return the hostname as is

		return n === 4 || (n === 3 && hostParts[n - 2].length <= 3)
			? `${hostParts[n - 3]}.${hostParts[n - 2]}.${hostParts[n - 1]}`
			: `${hostParts[n - 2]}.${hostParts[n - 1]}`;
	} catch (error) {
		console.error("Invalid URL:", url, error);
		return ""; // Return an empty string or handle as needed
	}
}

export function getDateAndMonth(date: number | undefined) {
	if (date) {
		const givenDate = new Date(date * 1000);
		return `${givenDate.getDate()} ${givenDate.toLocaleString("default", {
			month: "long",
		})}`;
	}
}

export function replaceSlugInURL(url: string, slug?: string) {
	const final_slug = slug || localStorage.getItem("slug") || "";
	return url.replace("{slug}", final_slug);
}

export const getDaysAgo = (date: number) => {
	const givenDate = new Date(date * 1000);
	const givenDateNum: number = new Date(date).getTime();
	const currentDate: number = new Date().getTime();
	const differenceInTime = currentDate - givenDateNum;
	const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

	if (differenceInDays === 0) {
		return "Today";
	} else if (differenceInDays === 1) {
		return "1 day ago";
	} else if (differenceInDays <= 30) {
		return `${differenceInDays} days ago`;
	} else {
		return `${givenDate.toLocaleString("default", {
			month: "long",
		})} ${givenDate.getDate()}, ${givenDate.getFullYear()}`;
	}
};
