import { useState, useEffect } from 'react';
import CountdownTimer from './countdown';
import DataCardBody from './DataCardBody';
import VisitChartCard from './VisitChartCard';
import { useNavigate } from 'react-router-dom';
import { DataCard } from './CardTypeComponents/DataCard';
import { YTCard } from './CardTypeComponents/YTCard';
import { ImageCard } from './CardTypeComponents/ImageCard';
import { CardTypeToRender, PendingCard, UserDataProps } from '../../common/interface';
import useFetch from '../../common/hooks/useFetch';
import {
  convertEpochToISO,
  getDateAndMonth,
  parseUrl,
  replaceSlugInURL,
  updateCardTypeToRenderInAllCards,
} from '../../common/utils';
import ProgressBar from './progressBar/progressBar';

const GET_CARD_DETAIL = 'cards/pending/{slug}';
const CREATE_PUBLISHED_CARDS = 'cards/published/{slug}';

export default function ProfileCardsComponent({ user, setUser, slug }: UserDataProps) {
  const navigate = useNavigate();

  // to fetch pending cards
  const [totalCardCount, setTotalCardCount] = useState(0);
  const [cards, setCards] = useState<PendingCard[]>([]);
  const [activeCardList, setActiveCardList] = useState<PendingCard[]>([]);
  const [activeCard, setActiveCard] = useState<PendingCard>(activeCardList[0]);

  // Fetch Pending Cards
  const { fetchData: fetchPendingCardData } = useFetch<PendingCard[]>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchPendingCardData(replaceSlugInURL(GET_CARD_DETAIL, slug), {
          onSuccessfulFetch(data) {
            if (data) {
              data = updateCardTypeToRenderInAllCards(data);
              setCards(data);
              setActiveCardList(data);
              setActiveCard(data[0]);
              setTotalCardCount(data.length);
              chrome.runtime.sendMessage({
                type: 'UPDATE_NOTIFICATION_COUNTER',
                counter: data.length,
              });
            }
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [slug]);

  // Remove Card
  const { fetchData: managePendingCardCreation } = useFetch<any>();
  const removeCard = (id: string, hasToPublished: boolean) => {
    console.log(id);
    if (hasToPublished) {
      user.profile_metadata.kleo_points++;
    }

    managePendingCardCreation(replaceSlugInURL(CREATE_PUBLISHED_CARDS, slug), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        isPublishCard: hasToPublished,
      }),
    });

    setCards((cards) => cards.filter((card) => card.id !== id));
    setActiveCardList((activeCardList) => activeCardList.filter((card) => card.id !== id));
    const active = activeCardList.filter((card) => card.id !== id)[0];
    setActiveCard(active);
    chrome.runtime.sendMessage({
      type: 'UPDATE_NOTIFICATION_COUNTER',
      counter: cards.length - 1,
    });
    if (cards.length - 1 === 0) {
      navigate('/card-created');
    }
  };

  const handleOnClick = (url: string) => window.open(url, '_blank');

  return (
    <>
      {activeCardList.length > 0 ? (
        <div className="flex flex-col justify-center items-center w-[400px] max-h-[448px] bg-[#FCFCFD] mt-[16px]">
          <div className="flex flex-col justify-center items-center w-[368px] h-[345px] bg-gray-100 rounded-lg px-[16px] py-[8px]">
            {/* KLEO points in top right corner */}
            <div className="flex flex-row bg-white h-[38px] p-2 rounded-md items-center ml-auto mt-1">
              <div className="flex my-[5px] bg-violet-100 w-7 h-7 items-center justify-center rounded-md">
                <img src="../assets/images/KleoToken.svg" className="flex w-[24px] h-[24px]" />
              </div>
              <div className="flex flex-row ml-2 mr-1">
                <div className="font-medium text-sm text-violet-700">
                  {user.profile_metadata.kleo_points ? user.profile_metadata.kleo_points : 0}
                </div>
                <div className="flex font-light text-[10px] text-violet-500 ml-1 text-center items-center">
                  KLEO
                </div>
              </div>
            </div>

            {/* Actual Card with all Data */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-[16px] mt-[16px]">
              <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mx-auto">
                {/* CardType == DataCard || PurpleCard */}
                {(activeCard.cardTypeToRender === CardTypeToRender.DATA ||
                  activeCard.cardTypeToRender === CardTypeToRender.PURPLE) && (
                  <DataCard activeCard={activeCard} handleOnClick={handleOnClick} key={activeCard.id} />
                )}

                {/* CardType == ImageCard */}
                {activeCard.cardTypeToRender === CardTypeToRender.IMAGE && <ImageCard card={activeCard} />}

                {/* CardType == YTCard */}
                {activeCard.cardTypeToRender === CardTypeToRender.YT && <YTCard activeCard={activeCard} />}

                {/* CardType == DOMAIN VISITED CARD */}
                {activeCard.cardType == 'DomainVisitCard' && (
                  <div className=" rounded-lg shadow-lg p-3 px-5 bg-[#42307D]  flex flex-col justify-between min-h-[200px] border border-white overflow-hidden bg-gradient-to-r from-violet-950 to-violet-900 mt-[20px]">
                    {/* Header for card*/}
                    <header className="relative flex flex-row items-center mt-3 justify-between">
                      <div className="flex flex-row items-center bg-opacity-50 backdrop-blur-md bg-white py-1 px-2 rounded-3xl">
                        {activeCard.urls.map((urls, index) => (
                          <img
                            className={` w-6 h-6 flex-none rounded-full fill-black`}
                            style={{
                              left: `${index * 1.3}rem`,
                            }}
                            src={`https://www.google.com/s2/favicons?domain=${urls.url}`}
                          />
                        ))}
                        <div className="font-inter font-medium text-sm text-white ml-2">
                          {parseUrl(activeCard.urls[0].url)}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-center mr-1 ml-auto py-[2px] text-white font-inter text-sm font-normal">
                        {activeCard.tags[2]}
                      </div>
                      <img
                        src="../assets/images/backFrameDataCard.svg"
                        className="absolute right-0 top-0 w-[204px] h-[189px] translate-x-20 -translate-y-10 z-10"
                      />
                    </header>

                    {/* Body for feed card */}
                    {activeCard.cardType == 'DomainVisitCard' && (
                      <DataCardBody
                        data={activeCard.metadata.activity[0]}
                        description={activeCard.content}
                        direction={activeCard.metadata.activity[1]}
                      />
                    )}
                  </div>
                )}

                {/* CardType == VISIT CHART CARD */}
                {activeCard.cardType == 'VisitChartCard' && (
                  <VisitChartCard
                    data={activeCard.metadata.activity}
                    date={`${getDateAndMonth(activeCard.metadata.dateFrom)} - ${getDateAndMonth(
                      activeCard?.metadata?.dateTo,
                    )}`}
                  />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-auto">
              <ProgressBar progress={Math.floor(((totalCardCount - cards.length) / totalCardCount) * 100)} />
            </div>
          </div>

          {/* Delete and Publish Buttons  */}
          <div className="flex flex-row gap-2 my-[16px] mx-[24px]">
            <button
              onClick={() => removeCard(activeCard.id, false)}
              className="flex justify-center items-center w-[165px] px-3 py-2 rounded-lg bg-gray-100 text-[#363F72] font-semibold"
            >
              <img
                src="../assets/images/cross.svg"
                className="flex w-[13px] h-[9px] stroke-[#363F72] fill-[#363F72] mr-1"
              />
              Delete
            </button>
            <button
              onClick={() => removeCard(activeCard.id, true)}
              className="flex justify-center items-center w-[165px] h-[44px] px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold"
            >
              <img
                src="../assets/images/check.svg"
                className="flex w-[13px] h-[9px] stroke-white fill-current mr-1"
              />
              Publish
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center w-[400px] min-h-[448px] bg-[#FCFCFD]">
            <div className="flex flex-col justify-start items-center w-[380px] h-[428px] bg-gray-100 rounded-lg px-[16px] pb-[8px]">
              <div className="flex flex-row bg-white h-[38px] p-2 rounded-md items-center ml-auto mt-4">
                <div className="flex my-[5px] bg-violet-100 w-7 h-7 items-center justify-center rounded-md">
                  <img src="../assets/images/KleoToken.svg" className="flex w-[24px] h-[24px]" />
                </div>
                <div className="flex flex-row ml-2 mr-1">
                  <div className="font-medium text-sm text-violet-700">
                    {user.profile_metadata.kleo_points ? user.profile_metadata.kleo_points : 0}
                  </div>
                  <div className="flex font-light text-[10px] text-violet-500 ml-1 text-center items-center">
                    KLEO
                  </div>
                </div>
              </div>
              <img src="../assets/images/spaceCat.svg" className="w-[157px] h-[152px]" />
              <div className="text-gray-700 font-semibold text-[16px] mt-[4px]">
                Yay! you are done for the day..
              </div>
              <div className="text-gray-500 font-normal text-[11px] mt-[4px]">
                Come back tomorrow for new cards
              </div>
              <div className="bg-gray-50 rounded-lg shadow-lg flex flex-col justify-between min-w-[desiredMinWeight] min-h-[desiredMinHeight] mt-12">
                <CountdownTimer
                  endDate={convertEpochToISO(user.last_cards_marked + 86400)}
                  isProfilePage={false}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
