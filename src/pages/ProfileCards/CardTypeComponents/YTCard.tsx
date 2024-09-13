import { YTCardImages } from './YTCardImages';
import ytLogo from '../../assets/images/ytLogo.png';
import { CardTypeToRender, PendingCard } from '../../../common/interface';
import { getDaysAgo } from '../../../common/utils';

interface YTCardProps {
  activeCard: PendingCard;
}

export const YTCard = ({ activeCard }: YTCardProps) => {
  return (
    <div
      className={`rounded-lg shadow-lg p-3 px-5 flex flex-col justify-between min-h-[desiredMinHeight] gap-2 bg-yt-card max-h-[230px]`}
    >
      {/* Body for YT card */}
      {activeCard.cardTypeToRender == CardTypeToRender.YT && <YTCardImages card={activeCard} />}

      {/* Header with favicons and date. */}
      <header className="relative flex items-center">
        <div key={activeCard.urls[0].id} className="w-6 h-6 flex-none rounded-full">
          <img
            className={`absolute w-6 h-6 flex-none rounded-full object-cover`}
            src={'../assets/images/ytLogo.png'}
          />
        </div>
        <div className="flex flex-row ml-auto items-center">
          <div className={`flex font-inter text-sm text-gray-400 font-normal`}>{getDaysAgo(activeCard.date)}</div>
        </div>
      </header>

      {/* Card Content */}
      <div className="flex flex-col justify-center mt-1">
        <blockquote className={`text-base font-normal text-white`}>
          {activeCard.content.length > 60 ? `${activeCard.content.slice(0, 60)}...` : activeCard.content}
        </blockquote>
      </div>
    </div>
  );
};
