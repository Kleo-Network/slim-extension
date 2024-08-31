import { useEffect, useState } from "react";
import useFetch from "../common/hooks/useFetch";
import { UserData } from "../common/interface";
import { LeaderBoardCardComponent } from "./LeaderBoardCardComponent";
import { ProfileCardComponent } from "./ProfileCardComponent";

interface LeaderBoardProps {
	slug: string;
	user: UserData;
}

interface IGetUserRankResponse {
	kleo_points: number;
	rank: number;
	slug: string;
	total_users: number;
}

const GET_USER_RANK = "user/rank/{slug}";

export const LeaderBoardComponent = ({ slug, user }: LeaderBoardProps) => {
	const { fetchData: fetchUserRank } = useFetch();

	const [rank, setRank] = useState("0");

	useEffect(() => {
		if (!user || !user.slug) {
			return;
		}

		const updatedGetUserRankUrl = GET_USER_RANK.replace(
			"{slug}",
			user.slug || ""
		);
		fetchUserRank(updatedGetUserRankUrl, {
			onSuccessfulFetch(data) {
				const typedData = data as IGetUserRankResponse;
				setRank(typedData["rank"].toString());
			},
		});
	}, [user, user.slug]);

	return (
		// leaderBoard Page Container
		<div className="h-[448px] bg-gray-lightest p-4 flex flex-col gap-4">
			<ProfileCardComponent user={user} rank={rank} />
			{/* <LeaderBoardCardComponent
				rank={rank}
				name={user.name}
				points={user.profile_metadata["kleo_points"]}
				ppUrl={user.pfp}
			/> */}
		</div>
	);
};
