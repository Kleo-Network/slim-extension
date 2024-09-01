import { capitalizeWords } from "../common/utils";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { truncateText } from "../common/utils";

interface NameAndMintLinkProps {
	avatar: {
		src: string;
		alt: string;
	};
	userName: string;
	metaMaskAddress: string;
}

export const NameAndMintLinkComponent = ({
	avatar,
	userName,
	metaMaskAddress,
}: NameAndMintLinkProps) => {
	// TODO : Update once we have API.
	const lastMintedDate = "April 26, 2024";
	// TODO: Remove this dummy value.
	metaMaskAddress = "0x573aFF24788A7c28dE5E94C945e7b46a6f16f7C1";
	const hasMetaMaskAddress = !!metaMaskAddress;

	function getUserProfile() {
		window.open(`https://www.app.kleo.network/setting/`, "_blank");
	}

	return (
		<div className="flex justify-between items-center h-[42px] w-full font-inter">
			<div className="flex justify-start items-center gap-2">
				<div className="h-10 w-10 rounded-full overflow-hidden items-center">
					{hasMetaMaskAddress ? (
						<MetaMaskAvatar address={metaMaskAddress} size={40} />
					) : (
						<img src={avatar.src} alt={avatar.alt} />
					)}
				</div>
				<div className="flex flex-col h-full">
					<p className="font-medium text-base overflow-ellipsis">
						{truncateText(
							hasMetaMaskAddress ? metaMaskAddress : capitalizeWords(userName),
							20
						)}
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
				Share
			</button>
		</div>
	);
};
