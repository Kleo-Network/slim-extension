import { capitalizeWords } from "../common/utils";

interface NameAndMintLinkProps {
	avatar: {
		src: string;
		alt: string;
	};
	userName: string;
}

export const NameAndMintLinkComponent = ({
	avatar,
	userName,
}: NameAndMintLinkProps) => {
	// TODO : Update once we have API.
	const lastMintedDate = "April 26, 2024";

	function getUserProfile() {
		window.open(`https://www.app.kleo.network/setting/`, "_blank");
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
