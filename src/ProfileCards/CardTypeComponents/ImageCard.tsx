import { PendingCard } from "../../common/interface";
import { getDaysAgo, parseUrl } from "../../common/utils";

interface ImageCardForPublishCardsProps {
	card: PendingCard;
}

export const ImageCard = ({ card }: ImageCardForPublishCardsProps) => {
	return (
		<div
			className={`rounded-lg shadow-lg p-3 px-5 flex flex-col justify-between max-h-[230px] bg-cover border border-white min-h-[150px] gap-2`}
			style={{ backgroundImage: `url(${card.stockImage})` }}
		>
			{/* Header for card [UrlFavicons, DaysAgoString, Options] */}
			<header className="relative flex items-center backdrop-blur-sm h-[46px]">
				{/* Map over all urls and show the favicon */}
				{Array.from(
					new Set(
						card.urls.map(
							(url) =>
								`https://www.google.com/s2/favicons?domain=${parseUrl(
									url.url
								)}&sz=40`
						)
					)
				).map((iconUrl, index) => (
					<div
						key={iconUrl}
						className="w-6 h-6 flex-none rounded-full border-spacing-4 flex items-center"
					>
						<img
							className="absolute w-6 h-6 flex-none rounded-full border-white border-2 fill-white"
							style={{
								left: `${index * 1.3}rem`,
							}}
							src={iconUrl}
						/>
					</div>
				))}

				<div className="flex flex-row ml-auto items-center backdrop-blur-sm">
					<div className="flex font-inter text-sm text-white font-normal">
						{getDaysAgo(card.date)}
					</div>
				</div>
			</header>

			{/* Card Content */}
			<div className="flex flex-col justify-center mt-1 backdrop-blur-sm">
				<blockquote className={`text-base font-normal text-white`}>
					{card.content.length > 120
						? `${card.content.slice(0, 120)}...`
						: card.content}
				</blockquote>
			</div>
		</div>
	);
};
