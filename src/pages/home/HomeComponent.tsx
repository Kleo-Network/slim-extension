import { MetaMaskAvatar } from 'react-metamask-avatar';
import { ACTIVITY_GRAPH_TITLE, KLEO_XP, MOCK_USER, SHARE_ON_X } from '../../common/constants';
import { UserData } from '../../common/interface';
import { convertTimeStampToDateString, truncateText } from '../../common/utils';
import { RadarChartComponent } from './RadarChartComponent';

const kleoCoinInContainerPath = '../assets/images/homeImages/kleoCoinInContainer.svg';

interface HomeComponentProps {
  user: UserData;
}

// Type definitions for canvas element
type CanvasSource = HTMLCanvasElement | HTMLImageElement;
// TODO: @vaibhav please update this endpoint to deployed one.
const UPLOAD_IMGUR_ENDPOINT = 'http://localhost:5001/api/v2/core/user/upload_activity_chart';

const uploadImageToBackend = async (imageData: string): Promise<string | null> => {
  try {
    const response = await fetch(UPLOAD_IMGUR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });

    // Ensure that the response is okay and JSON is parsed
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.url; // The URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// Function to create a temporary canvas with a white background
const createCanvasWithWhiteBackground = (canvas: CanvasSource): string => {
  const tempCanvas = document.createElement('canvas') as HTMLCanvasElement;
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  if (tempCtx) {
    // Draw white background on the temporary canvas
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original chart on top of the white background
    tempCtx.drawImage(canvas, 0, 0);
  }

  return tempCanvas.toDataURL('image/png', 1).split(',')[1]; // Return base64 image data
};

// Function to construct the tweet text
const constructTweetText = (imageUrl: string): string => {
  return `Check out my Activity! My data activity was most in 'Designing' followed by Coding and Politics. Got rewarded 230 Kleo Points for the same.

Create your profile and get Kleo points!
@kleo_network #KLEO ${imageUrl} `; // Add a space after URL
};

// Main function to handle sharing on Twitter
const handleShareOnTwitter = async (canvas: CanvasSource) => {
  // Create the canvas with a white background and get the image data
  const imageData = createCanvasWithWhiteBackground(canvas);

  // Upload image to backend
  const imageUrl = await uploadImageToBackend(imageData);

  if (imageUrl) {
    // Remove the .png extension from the Imgur URL (if it exists)
    const imageUrlWithoutExtension = imageUrl.replace('.png', '');

    // Construct the tweet text
    const tweetText = constructTweetText(imageUrlWithoutExtension);

    // Open Twitter share dialog
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  } else {
    console.error('Failed to upload image.');
  }
};

export const HomeComponent = ({ user }: HomeComponentProps) => {
  user = MOCK_USER;

  const handleShareClick = async () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    await handleShareOnTwitter(canvas); // Pass the canvas to the handler
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
          <button className="size-9 rounded-full text-white" onClick={handleShareClick}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 24 24">
              <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,7v10	c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V7c0-2.209,1.791-4,4-4h10C19.209,3,21,4.791,21,7z M17.538,17l-4.186-5.99L16.774,7	h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
            </svg>
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
