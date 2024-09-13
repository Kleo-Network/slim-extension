import { CardTypeToRender, PendingCard } from '../../../common/interface';
import { getDaysAgo, parseUrl } from '../../../common/utils';

interface DataCardProps {
  activeCard: PendingCard;
  handleOnClick: Function;
}

export const DataCard = ({ activeCard, handleOnClick }: DataCardProps) => {
  const isPurpleCard = activeCard.cardTypeToRender === CardTypeToRender.PURPLE;

  return (
    <div
      className={`rounded-lg shadow-lg p-3 px-5 flex flex-col justify-between min-h-[desiredMinHeight] gap-2 bg-white max-h-[250px]`}
      style={
        isPurpleCard
          ? {
              backgroundImage: `url('../assets/images/purpleCardBg.png')`,
            }
          : {}
      }
    >
      {/* Header with favicons and date. */}
      <header className="relative flex items-center">
        {/* Map over all urls and show the favicon */}
        {Array.from(
          new Set(
            activeCard.urls.map((url) => `https://www.google.com/s2/favicons?domain=${parseUrl(url.url)}&sz=40`),
          ),
        ).map((iconUrl, index) => (
          <div key={iconUrl} className="w-6 h-6 flex-none rounded-full border-spacing-4">
            <img
              className={`absolute w-6 h-6 flex-none rounded-full border-2 ${
                isPurpleCard ? 'border-purple-card fill-purple-card' : 'border-white fill-white'
              }`}
              style={{
                left: `${index * 1.3}rem`,
              }}
              src={iconUrl}
            />
          </div>
        ))}
        <div className="flex flex-row ml-auto items-center">
          <div className={`flex font-inter text-sm ${isPurpleCard ? 'text-white' : 'text-gray-400'} font-normal`}>
            {getDaysAgo(activeCard.date)}
          </div>
        </div>
      </header>

      {/* Card Content */}
      <div className="flex flex-col justify-center mt-1">
        <blockquote className={`text-base font-normal ${isPurpleCard ? 'text-white' : 'text-gray-600'}`}>
          {activeCard.content.length > 120 && activeCard.cardTypeToRender !== CardTypeToRender.YT
            ? `${activeCard.content.slice(0, 120)}...`
            : activeCard.content}
        </blockquote>
      </div>

      {/* URL pills in bottom */}
      <div className="flex flex-row w-full flex-wrap gap-2 self-stretch items-center justify-start pt-5">
        <>
          {activeCard.urls.map((urls) => (
            <button
              className={`flex items-center gap-2 rounded-3xl border px-2 py-1 ${
                isPurpleCard ? 'border-none bg-white/20' : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => handleOnClick(urls.url)}
            >
              <img
                className="w-4 h-4 flex-none rounded-full"
                src={`https://www.google.com/s2/favicons?domain=${urls.url}&sz=16`}
              />

              <h3
                className={`inline-block text-xs font-medium ${
                  isPurpleCard ? 'text-white' : 'text-gray-700'
                } overflow-hidden overflow-ellipsis line-clamp-1`}
              >
                {activeCard.urls.length > 2 && urls.title.length > 10
                  ? urls.title.trim().slice(0, 10) + '...'
                  : urls.title.trim().slice(0, 25) + '...'}
              </h3>
            </button>
          ))}
        </>
      </div>
    </div>
  );
};
