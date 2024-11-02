import { useEffect, useState } from 'react';
import useFetch, { FetchStatus } from '../../common/hooks/useFetch';
import { ACTIVITY_GRAPH_TITLE, KLEO_XP } from '../../common/constants';
import { UserData } from '../../common/interface';
import { truncateText } from '../../common/utils';
import { RadarChartComponent } from './RadarChartComponent';
import Processing from '../ProfileCards/Processing';
import { Method } from 'axios';

const kleoCoinInContainerPath = '../assets/images/homeImages/kleoCoinInContainer.svg';

interface HomeComponentProps {
  user: UserData;
  isUserLoading: boolean;
}

// Define the API endpoints
const GET_USER_GRAPH = 'user/get-user-graph/{slug}';
const UPLOAD_IMGUR_ENDPOINT = 'user/upload_activity_chart'; // Adjusted endpoint

// Define the interface for the API responses
interface UserGraphResponse {
  processing?: boolean;
  data?: GraphLabelItem[];
  error?: string;
}

interface GraphLabelItem {
  label: string;
  percentage: number;
}

interface UploadResponse {
  url?: string;
  error?: string;
}

// Function to construct the API endpoint with the user's slug
function getUserGraphEndpoint(slug: string) {
  return GET_USER_GRAPH.replace('{slug}', slug);
}

// Type definitions for canvas element
type CanvasSource = HTMLCanvasElement | HTMLImageElement;

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const getCachedImageUrl = () => {
  const cachedUrl = localStorage.getItem('cachedImageUrl');
  const lastUploadTime = localStorage.getItem('lastUploadTime');

  if (cachedUrl && lastUploadTime) {
    const timeSinceLastUpload = Date.now() - parseInt(lastUploadTime);
    if (timeSinceLastUpload <= ONE_HOUR_IN_MS) {
      return cachedUrl; // Return cached URL if it's still valid (within one hour)
    }
  }

  return null; // No valid cached URL
};

const cacheImageUrl = (url: string) => {
  localStorage.setItem('cachedImageUrl', url);
  localStorage.setItem('lastUploadTime', Date.now().toString());
};

export const HomeComponent = ({ user }: HomeComponentProps) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<any>([]);
  const [isChartLoading, setIsChartIsLoading] = useState(false);
  const { fetchData: fetchUserGraph } = useFetch<UserGraphResponse>();
  const { fetchData: uploadImageFetch } = useFetch<UploadResponse>();
  let isRequestInProgress = false;

  useEffect(() => {
    setIsChartIsLoading(true);
    fetchUserGraph(getUserGraphEndpoint(user.address || ''), {
      onSuccessfulFetch(data) {
        if (data?.error) {
          setIsProcessing(true);
        } else if (data?.processing) {
          setIsProcessing(true);
        } else {
          setIsProcessing(false);
          if (graphData) {
            setGraphData(data?.data);
          }
        }
        setIsChartIsLoading(false);
      },
    });
  }, [user.address]);

  const createCanvasWithWhiteBackground = (canvas: CanvasSource): string => {
    const tempCanvas = document.createElement('canvas') as HTMLCanvasElement;
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);
    }

    return tempCanvas.toDataURL('image/png', 1).split(',')[1]; // Return base64 image data
  };

  const constructTweetText = (imageUrl: string): string => {
    const top3Activities = graphData
      .slice(0, 3)
      .map((activity: { label: any }) => activity.label)
      .join(', ');
    return `Check out my Activity! My top 3 activities are ${top3Activities}. My current Kleo points are ${user.kleo_points || 0}.
Create your profile and get Kleo points! @kleo_network #KLEO ${imageUrl}`;
  };

  const handleShareClick = async () => {
    // Prevent multiple clicks and ensure rate limiting
    if (isRequestInProgress) {
      console.log('Please wait, your previous request is still processing...');
      return;
    }

    const cachedUrl = getCachedImageUrl();
    if (cachedUrl) {
      // Use cached URL if it's still valid
      const tweetText = constructTweetText(cachedUrl);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank');
      return;
    }

    isRequestInProgress = true; // Mark request as in progress

    try {
      const canvas = document.getElementsByTagName('canvas')[0];
      const imageData = createCanvasWithWhiteBackground(canvas);

      const options = {
        method: 'POST' as Method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      };

      const data = await uploadImageFetch(UPLOAD_IMGUR_ENDPOINT, options);

      if (data && data.url) {
        const imageUrlWithoutExtension = data.url?.replace('.png', '');

        // Cache the new URL and timestamp
        cacheImageUrl(imageUrlWithoutExtension);

        const tweetText = constructTweetText(imageUrlWithoutExtension);

        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, '_blank');
      } else {
        console.error('Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      isRequestInProgress = false; // Reset request flag after completion
    }
  };

  return (
    <div className="h-full w-full bg-gray-blue-100 p-4 flex gap-4 flex-col">
      <div className="flex justify-between items-center w-full h-[42px]">
        <div className="flex flex-1 justify-start items-center gap-2 h-full mr-8">
          <div className="flex flex-col items-start justify-center h-full w-fit">
            <div className="font-semibold text-base text-gray-700">{truncateText(user.address || '', 20)}</div>
          </div>
        </div>
        {/* Kleo Points Display */}
        <div className="h-9 bg-white w-max rounded-lg p-[6px] flex items-center justify-normal gap-2">
          <img src={kleoCoinInContainerPath} className="flex w-[24px] h-[24px]" />
          <div className="text-primary-btn-500 flex gap-1 mt-1 w-max">
            <span className="font-semibold text-sm w-max">{user.kleo_points}</span>
            <span className="font-normal text-[8px] leading-6 w-max">{KLEO_XP}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full h-full">
        <div className="bg-white w-full h-full flex-1 flex flex-col justify-between rounded-lg p-4 gap-4">
          {/* Processing Banner */}
          {isProcessing && !isChartLoading && <Processing />}
          {/* Radar Activity Chart + Chart Title + Share Button */}
          {!isProcessing && (
            <>
              {isChartLoading && (
                <div className="h-full w-full flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              )}
              {!isChartLoading && !isProcessing && (
                <>
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-base text-black">{ACTIVITY_GRAPH_TITLE}</span>
                    <button className="size-9 rounded-full text-white" onClick={handleShareClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
                        <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,7v10	c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V7c0-2.209,1.791-4,4-4h10C19.209,3,21,4.791,21,7z M17.538,17l-4.186-5.99L16.774,7	h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="w-full flex-1 max-h-[284px]">
                    {graphData.length > 0 && <RadarChartComponent graph={graphData} />}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
