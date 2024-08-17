import { PendingCard } from "../../common/interface";
import { extractThumbNailURL } from "../../common/utils";

interface YTCardImagesProps {
	card: PendingCard;
}

interface ThumbnailProps {
	url: string;
	extraStyles?: string;
}

export function YTCardImages({ card }: YTCardImagesProps) {
	const videoUrls: string[] = card.urls.map((url) =>
		extractThumbNailURL(url.url)
	);

	const renderThumbnails = () => {
		switch (videoUrls.length) {
			case 4:
				return (
					<div className="flex justify-between items-center w-full gap-2 h-full">
						<div className="flex items-center justify-center w-4/5">
							<Thumbnail url={videoUrls[0]} extraStyles="h-[120px]" />
						</div>
						<div className="flex flex-col gap-2 grow">
							{videoUrls.slice(1).map((url, index) => (
								<Thumbnail key={index} url={url} extraStyles="h-[34px]" />
							))}
						</div>
					</div>
				);
			case 3:
				return (
					<div className="flex justify-between items-center w-full gap-2 h-full">
						<div className="flex items-center justify-center w-4/5">
							<Thumbnail url={videoUrls[0]} extraStyles="h-[120px]" />
						</div>
						<div className="flex flex-col gap-2 grow">
							{videoUrls.slice(1).map((url, index) => (
								<Thumbnail key={index} url={url} extraStyles="h-[56px]" />
							))}
						</div>
					</div>
				);
			case 2:
				return (
					<div className="flex flex-wrap xl:flex-col justify-evenly items-center content-center w-full gap-2 h-full">
						{videoUrls.map((url, index) => (
							<Thumbnail key={index} url={url} />
						))}
					</div>
				);
			case 1:
				return (
					<div className="flex flex-wrap justify-between items-center content-center w-full gap-2 h-full">
						<Thumbnail url={videoUrls[0]} extraStyles="h-[115px]" />
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="h-[120px] w-full flex content-center">
			{renderThumbnails()}
		</div>
	);
}

function Thumbnail({ url, extraStyles = "" }: ThumbnailProps) {
	return (
		<img
			src={url}
			alt="Thumbnail"
			className={`bg-gray-200 rounded-lg object-cover grow min-w-[20px] aspect-[1.7] ${extraStyles}`}
		/>
	);
}
