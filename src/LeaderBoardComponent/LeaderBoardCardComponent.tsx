interface LeaderBoardRowProps {
	isUserRow?: boolean;
	rank: string;
	userName: string;
	points: string;
	ppUrl: string;
}

export const LeaderBoardCardComponent = () => {
	return (
		<div className="h-[270px] w-[367px] rounded-lg overflow-y-scroll relative scrollbar-thin scrollbar-webkit">
			<div
				className="h-11 py-3 px-4 text-sm font-medium rounded-lg rounded-b-none text-secondary fixed bg-gray-background"
				style={{ width: "inherit" }}
			>
				Leaderboard
			</div>
			<div className="p-2 flex flex-col gap-2 w-full pt-11 bg-gray-background rounded-lg">
				{/* TODO: Replace this with an Map when we have APIs ready. */}
				<LeaderBoardRowComponent
					isUserRow={true}
					rank="141"
					userName="Prince Dalsaniya"
					points="120"
					ppUrl="../assets/images/statsImages/winnerCup.svg"
				/>
				<LeaderBoardRowComponent
					rank="1"
					userName="ABC"
					points="5000"
					ppUrl="../assets/images/statsImages/kleoPoints.svg"
				/>
				<LeaderBoardRowComponent
					rank="2"
					userName="DEF"
					points="490"
					ppUrl="../assets/images/statsImages/kleoPoints.svg"
				/>
				<LeaderBoardRowComponent
					rank="3"
					userName="GHI"
					points="480"
					ppUrl="../assets/images/statsImages/kleoPoints.svg"
				/>
				<LeaderBoardRowComponent
					rank="4"
					userName="JKL"
					points="470"
					ppUrl="../assets/images/statsImages/kleoPoints.svg"
				/>
				<LeaderBoardRowComponent
					rank="5"
					userName="MNO"
					points="460"
					ppUrl="../assets/images/statsImages/kleoPoints.svg"
				/>
				<LeaderBoardRowComponent
					rank="6"
					userName="PQR"
					points="450"
					ppUrl="../assets/images/statsImages/kleoPoints.svg"
				/>
			</div>
		</div>
	);
};

const LeaderBoardRowComponent = ({
	isUserRow = false,
	rank,
	userName,
	points,
	ppUrl,
}: LeaderBoardRowProps) => {
	return (
		<div
			className={`h-[44px] w-[330px] rounded-lg px-4 py-2 flex justify-between items-center  ${
				isUserRow
					? "bg-secondary text-white"
					: "bg-white text-secondary"
			}`}
		>
			<div className="flex items-center align-middle justify-between gap-2 font-medium text-xs">
				<div className="w-6 text-center ">{rank}</div>
				<img src={ppUrl} className="w-6 h-6 rounded-full" />
				<div className="text-left">{userName}</div>
			</div>
			<div className="font-medium text-sm align-middle">
				{points} <span className="text-[10px] align-middle">KLEO</span>
			</div>
		</div>
	);
};
