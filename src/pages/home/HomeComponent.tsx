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
  // Function to download the radar chart as an image
  const downloadImage = () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    const imageLink = document.createElement('a');
    imageLink.download = 'activityChart.png';
    imageLink.href = canvas.toDataURL('image/png', 1);
    imageLink.click();
  };

  // Function to open Twitter share dialog with pre-filled content
  const shareOnTwitter = () => {
    const text = `Check out my Activity! My data activity was most in 'Designing' followed by Coding and Politics. Got rewarded 230 Kleo Points for the same.

Create your profile and get Kleo points!
@kleo_network #KLEO`;

    // Twitter web intent URL - for sharing text and hashtags
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    // Open Twitter share dialog in a new tab
    window.open(twitterUrl, '_blank');
  };

  // Combined handler: download the image and open Twitter share dialog
  const handleShareOnTwitter = () => {
    downloadImage(); // First, download the image
    setTimeout(() => {
      shareOnTwitter(); // Then, guide the user to share it on Twitter
    }, 500); // Small delay to ensure the download process starts before opening Twitter
  };

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
          <button
            className="h-9 w-max px-4 py-2 text-white bg-primary-btn-500 hover:bg-primary-btn-600 rounded-lg"
            onClick={handleShareOnTwitter}
          >
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
