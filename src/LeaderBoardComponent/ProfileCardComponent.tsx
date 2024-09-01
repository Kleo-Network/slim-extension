import { UserData } from "../common/interface";
import { NameAndMintLinkComponent } from "./NameAndMintLinkComponent";
import { StatsCardComponent } from "./StatsCardComponent";

interface ProfileCardProps {
	user: UserData;
	rank: {
		rank: string;
		totalUsers: string;
	};
	qualityPercentage: string;
}

export const ProfileCardComponent = ({
	user,
	rank,
	qualityPercentage,
}: ProfileCardProps) => {
	// TODO : Update once we have API.
	const streak = "21";

	return (
		<div className="w-[367px] h-[142px] bg-white rounded-lg p-4 flex flex-col gap-4">
			<NameAndMintLinkComponent
				avatar={{ src: user.pfp, alt: "Profile" }}
				userName={user.name}
				metaMaskAddress={user.metaMaskAddress || ""}
			/>
			<StatsCardComponent
				kleoPoints={user.profile_metadata["kleo_points"]}
				rank={rank.rank}
				totalUserCount={rank.totalUsers}
				streak={streak}
				qualityPercentage={qualityPercentage}
			/>
		</div>
	);
};
