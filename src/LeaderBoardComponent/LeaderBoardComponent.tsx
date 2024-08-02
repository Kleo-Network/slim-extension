import { UserData } from "../common/interface";

interface LeaderBoardProps {
	slug: string;
	user: UserData;
}

export const LeaderBoardComponent = ({ slug, user }: LeaderBoardProps) => {
	function getUserProfile() {
		window.open(`https://www.app.kleo.network/profileV2/${slug}`, "_blank");
	}

	return (
		<>
			<div className="w-full flex justify-center pt-10">
				<button
					type="button"
					onClick={getUserProfile}
					className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 min-w-fit max-w-fit"
				>
					Mint
				</button>
			</div>
		</>
	);
};
