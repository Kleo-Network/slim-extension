interface StatesCardProps {
	kleoPoints: string;
	streak: string;
	rank: string;
}

interface StateProps {
	legend: string;
	count: string;
	imgSrc: string;
}

export const StatsCardComponent = ({
	kleoPoints,
	rank,
	streak,
}: StatesCardProps) => {
	return (
		<div className="flex justify-between items-center h-[52px] w-full font-inter">
			<StatComponent
				legend="KLEO Points"
				count={kleoPoints}
				imgSrc="../assets/images/statsImages/kleoPoints.svg"
			/>
			<div className="w-[1px] h-9 bg-gray-background "></div>
			<StatComponent
				legend="Rank"
				count={rank}
				imgSrc="../assets/images/statsImages/winnerCup.svg"
			/>
			<div className="w-[1px] h-9 bg-gray-background "></div>
			<StatComponent
				legend="Streak"
				count={streak}
				imgSrc="../assets/images/statsImages/fire.svg"
			/>
		</div>
	);
};

const StatComponent = ({ legend, count, imgSrc }: StateProps) => {
	return (
		<div className="h-full flex justify-start gap-2 py-2 w-[101px]">
			<div className="icon-container h-9 w-9 rounded-lg bg-gray-lightest flex justify-center items-center">
				<img src={imgSrc} alt="" className="w-5 h-5" />
			</div>
			<div className="flex flex-col h-full justify-center">
				<p className="font-semibold text-sm">{count}</p>
				<p className="text-gray-subheader font-medium text-[8px]">
					{legend}
				</p>
			</div>
		</div>
	);
};
