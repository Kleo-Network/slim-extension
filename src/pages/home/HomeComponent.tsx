import { MetaMaskAvatar } from 'react-metamask-avatar';
import { ACTIVITY_GRAPH_TITLE, KLEO_XP, MOCK_USER, SHARE_ON_X } from '../../common/constants';
import { UserData } from '../../common/interface';
import { convertTimeStampToDateString, truncateText } from '../../common/utils';
import { RadarChartComponent } from './RadarChartComponent';

interface HomeComponentProps {
  user: UserData;
}

const kleoCoinInContainerPath = '../assets/images/homeImages/kleoCoinInContainer.svg';

export const HomeComponent = ({ user }: HomeComponentProps) => {
  user = MOCK_USER;

  return (
    <div className="h-full w-full bg-gray-blue-100 p-4 flex gap-4 flex-col">
      {/* Name + Kleo Points Top-bar */}
      <div className="flex justify-between items-center w-full h-[42px]">
        <div className="flex flex-1 justify-start items-center gap-2 h-full mr-8">
          {/* <img src={pfp} alt="Profile Picture" className="size-9 rounded-full" /> */}
          <MetaMaskAvatar address={user.slug} size={36} />
          <div className="flex flex-col items-start justify-center h-full w-fit">
            <div className="font-semibold text-base text-gray-700">{truncateText(user.slug, 20)}</div>
            <div className="font-normal text-[10px] leading-[18px] text-gray-500">
              Last minted on {convertTimeStampToDateString(user.last_minted)}
            </div>
          </div>
        </div>
        {/* Button at the right end */}
        <div className="h-9 bg-white w-max rounded-lg p-[6px] flex items-center justify-normal gap-2">
          <img src={kleoCoinInContainerPath} className="flex w-[24px] h-[24px]" />
          <div className="text-primary-btn-500 flex gap-1 mt-1 w-max">
            <span className="font-semibold text-sm w-max">{user.kleo_points}</span>
            <span className="font-normal text-[8px] leading-6 w-max">{KLEO_XP}</span>
          </div>
        </div>
      </div>
      {/* Activity Cart Wrapper */}
      <div className="bg-white  w-full flex-1 flex flex-col justify-between rounded-lg p-4 gap-4">
        {/* Title + ShareOnX */}
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-base text-black">{ACTIVITY_GRAPH_TITLE}</span>
          {/* Share on X button */}
          <button className="h-9 w-max px-4 py-2 text-white bg-primary-btn-500 hover:bg-primary-btn-600 rounded-lg">
            {SHARE_ON_X}
          </button>
        </div>
        {/* Chart */}
        <div className="w-full flex-1 max-h-[264px]">
          <RadarChartComponent />
        </div>
      </div>
    </div>
  );
};
