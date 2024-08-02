interface NameAndMintLinkProps {
	avatar: {
		src: string;
		alt: string;
	};
	userName: string;
	slug: string;
}

export const NameAndMintLinkComponent = ({
	avatar,
	slug,
	userName,
}: NameAndMintLinkProps) => {
	const lastMintedDate = "April 26, 2024";

	function getUserProfile() {
		window.open(`https://www.app.kleo.network/profileV2/${slug}`, "_blank");
	}

	function capitalizeWords(input: string): string {
		return input
			.split(" ") // Split the string into words
			.map(
				(word) =>
					word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
			) // Capitalize first letter and lower the rest
			.join(" "); // Join the words back into a single string
	}

	return (
		<div className="flex justify-between items-center h-[42px] w-full font-inter">
			<div className="flex justify-start items-center gap-2">
				<div className="h-10 w-10 rounded-full overflow-hidden items-center">
					<img src={avatar.src} alt={avatar.alt} />
				</div>
				<div className="flex flex-col h-full">
					<p className="font-medium text-base">
						{capitalizeWords(userName)}
					</p>
					<p className="text-gray-subheader font-normal text-xs">
						Last minted on {lastMintedDate}
					</p>
				</div>
			</div>
			<button
				type="button"
				onClick={getUserProfile}
				className="focus:outline-none text-white bg-primary-btn-500 hover:bg-primary-btn-600 focus:ring-4 focus:ring-primary-btn-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 min-w-fit max-w-fit"
			>
				Mint
			</button>
		</div>
	);
};
