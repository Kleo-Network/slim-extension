import { UserData } from "../common/interface";
import { LeaderBoardCardComponent } from "./LeaderBoardCardComponent";
import { ProfileCardComponent } from "./ProfileCardComponent";

interface LeaderBoardProps {
	slug: string;
	user: UserData;
}

export const LeaderBoardComponent = ({ slug, user }: LeaderBoardProps) => {
	return (
		// leaderBoard Page Container
		<div className="h-[448px] bg-gray-lightest p-4 flex flex-col gap-4">
			<ProfileCardComponent user={user} />
			<LeaderBoardCardComponent />
		</div>
	);
};
