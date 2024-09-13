import { PendingCard } from '../../../common/interface';
import { extractThumbNailURL } from '../../../common/utils';

interface YTCardImagesProps {
  card: PendingCard;
}

interface ThumbnailProps {
  videoUrl: string;
  thumbUrl: string;
  extraStyles?: string;
  scale?: string;
}

export function YTCardImages({ card }: YTCardImagesProps) {
  const videoUrls: { thumbUrl: string; videoUrl: string }[] = card.urls
    .map((url) => ({
      thumbUrl: extractThumbNailURL(url.url),
      videoUrl: url.url,
    }))
    .filter((item) => item.thumbUrl !== '');

  const renderThumbnails = () => {
    switch (videoUrls.length) {
      case 4:
        return (
          <div className="flex items-center w-full gap-2 h-full">
            <div className="flex items-center justify-center flex-grow-2 w-4/5">
              <Thumbnail
                thumbUrl={videoUrls[0].thumbUrl}
                videoUrl={videoUrls[0].videoUrl}
                extraStyles="h-[120px] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 grow w-1/4 h-full">
              {videoUrls.slice(1).map((url, index) => (
                <Thumbnail
                  key={index}
                  thumbUrl={url.thumbUrl}
                  videoUrl={url.videoUrl}
                  extraStyles="h-[34px] w-full"
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center w-full gap-2 h-full">
            <div className="flex items-center justify-center flex-grow-2 w-4/5">
              <Thumbnail
                thumbUrl={videoUrls[0].thumbUrl}
                videoUrl={videoUrls[0].videoUrl}
                extraStyles="h-[120px] w-full grow"
              />
            </div>
            <div className="flex flex-col gap-2 grow w-1/4 h-full">
              {videoUrls.slice(1).map((url, index) => (
                <Thumbnail
                  key={index}
                  thumbUrl={url.thumbUrl}
                  videoUrl={url.videoUrl}
                  extraStyles="h-[56px]"
                  scale="scale-[1.3]"
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center w-full gap-2 h-full">
            {videoUrls.map((url, index) => (
              <Thumbnail
                key={index}
                thumbUrl={url.thumbUrl}
                videoUrl={url.videoUrl}
                extraStyles="w-1/2 h-full"
                scale="scale-[1.3]"
              />
            ))}
          </div>
        );
      case 1:
        return (
          <div className="flex flex-wrap justify-center items-center content-center w-full gap-2 h-full">
            <Thumbnail
              thumbUrl={videoUrls[0].thumbUrl}
              videoUrl={videoUrls[0].videoUrl}
              extraStyles="w-full h-[115px]"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[120px] w-full flex content-center rounded-lg overflow-hidden">{renderThumbnails()}</div>
  );
}

function Thumbnail({ videoUrl, thumbUrl, extraStyles = '', scale = '' }: ThumbnailProps) {
  return (
    <div className={`rounded-lg overflow-hidden flex justify-center items-center ${extraStyles}`}>
      <img
        src={thumbUrl}
        alt="Thumbnail"
        className={`bg-gray-200 rounded-lg object-cover transform w-full h-full cursor-pointer ${scale}`}
        onClick={() => window.open(videoUrl, '_blank')}
      />
    </div>
  );
}
