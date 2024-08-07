import { useState, useEffect } from 'react'
import CountdownTimer from './countdown'
import { PendingCard, UserDataProps } from '../common/interface'
import useFetch from '../common/hooks/useFetch'
import ProgressBar from '../progressBar/progressBar'
import DataCardBody from './DataCardBody'
import VisitChartCard from './VisitChartCard'
import { useNavigate } from 'react-router-dom'
import { convertEpochToISO } from '../common/utils'

export default function App({ user, setUser, slug}: UserDataProps) {

  const emptyStringArray: string[] = []
  const [totalCardCount, setTotalCardCount] = useState(0);
  const navigate = useNavigate()

  const formatDate = (epoch: number): string => {
    const date = new Date(epoch * 1000) // Convert epoch to milliseconds

    const day = String(date.getDate()).padStart(2, '0') // Ensure two digits for day
    const year = date.getFullYear()

    return `${day} ${new Date(epoch * 1000).toLocaleDateString('en-US', {
      month: 'long'
    })} ${year}`
  }

  // to fetch pending cards
  const [cards, setCards] = useState<PendingCard[]>([])
  const [activeCardList, setActiveCardList] = useState<PendingCard[]>([])
  const [activeCard, setActiveCard] = useState<PendingCard>(activeCardList[0])
  const [selectedDate, setSelectedDate] = useState<string>(
    null as unknown as string
  )
  const GET_CARD_DETAIL = 'cards/pending/{slug}'
  const { fetchData: fetchPendingCardData } = useFetch<PendingCard[]>()
  const { fetchData: managePendingCardCreation } = useFetch<any>()
  const CREATE_PUBLISHED_CARDS = 'cards/published/{slug}'

  function createPendingCard(slug: string) {
    return CREATE_PUBLISHED_CARDS.replace('{slug}', slug)
  }

  function getPendingCardDetails(slug: string) {
    return GET_CARD_DETAIL.replace('{slug}', slug)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPendingCardData(getPendingCardDetails(slug), {
          onSuccessfulFetch(data) {
            if (data) {
              setCards(data)
              setActiveCardList(data)
              setActiveCard(data[0])
              setTotalCardCount(data.length)
              chrome.runtime.sendMessage({ type: 'UPDATE_NOTIFICATION_COUNTER', counter: (data.length)})
            }
          }
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [slug])

  const filterCards = (selectedDate: string) => {
    const filteredCards = cards.filter((card) => {
      if (!selectedDate) {
        return true // Show all cards if no date is selected
      }
      return formatDate(card.date) == selectedDate
    })
    setActiveCardList(filteredCards)
    setActiveCard(filteredCards[0])
  }

  const getLastFourDates = (cards: PendingCard[]) => {
    const uniqueDates = new Set(cards.map((card) => formatDate(card.date)))
    const datesArray = Array.from(uniqueDates)
    return datesArray.slice(0, 4) // Get the first 4 elements
  }

  const availableDates = getLastFourDates(cards)

  const handleOnClick = (url: string) => {
    window.open(url, '_blank')
  }

  function parseUrl(url: string): string {
    // Ensure the URL starts with http:// or https://
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url
    }

    // Parse the URL
    const parsedUrl = new URL(url)
    const hostParts = parsedUrl.hostname.split('.')
    const n = hostParts.length
    let domain = ''

    // Determine the domain and domainX
    if (n >= 2) {
      if (n === 4 || (n === 3 && hostParts[n - 2].length <= 3)) {
        domain =
          hostParts[n - 3] + '.' + hostParts[n - 2] + '.' + hostParts[n - 1]
      } else {
        domain = hostParts[n - 2] + '.' + hostParts[n - 1]
      }
    }

    return domain
  }

  const getDateAndMonth = (date: number) => {
    const givenDate = new Date(date * 1000)
    return `${givenDate.getDate()} ${givenDate.toLocaleString('default', {
      month: 'long'
    })}`
  }

  const removeCard = (id: string, hasToPublished: boolean) => {
    console.log(id)
    if (hasToPublished) {
      user.profile_metadata.kleo_points++
    }

    managePendingCardCreation(createPendingCard(slug), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        isPublishCard: hasToPublished
      })
    })

    setCards((cards) => cards.filter((card) => card.id !== id))
    setActiveCardList((activeCardList) =>
      activeCardList.filter((card) => card.id !== id)
    )
    const active = activeCardList.filter((card) => card.id !== id)[0]
    setActiveCard(active)
    chrome.runtime.sendMessage({ type: 'UPDATE_NOTIFICATION_COUNTER', counter: (cards.length - 1)})
    if(cards.length - 1 === 0 ) {
      navigate("/card-created")
    }
  }

  const user1 =
    'https://cdn.midjourney.com/bb411caf-06cd-4343-93e1-dfa1e1945a30/0_3.webp'

  const getDaysAgo = (date: number) => {
    const givenDate = new Date(date * 1000)
    const givenDateNum:number = (new Date(date)).getTime()
    const currentDate: number = (new Date()).getTime()
    const differenceInTime = currentDate - givenDateNum
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24))

    if (differenceInDays === 0) {
      return 'Today'
    } else if (differenceInDays === 1) {
      return '1 day ago'
    } else if (differenceInDays <= 30) {
      return `${differenceInDays} days ago`
    } else {
      return `${givenDate.toLocaleString('default', {
        month: 'long'
      })} ${givenDate.getDate()}, ${givenDate.getFullYear()}`
    }
  }

  return (
    <>
    {activeCardList.length > 0 ? (
    <div className="flex flex-col justify-center items-center w-[400px] max-h-[448px] bg-[#FCFCFD] mt-[16px]">
      <div className="flex flex-col justify-center items-center w-[368px] h-[345px] bg-gray-100 rounded-lg px-[16px] py-[8px]">
        <div className='flex flex-row bg-white h-[38px] p-2 rounded-md items-center ml-auto mt-1'>
          <div className='flex my-[5px] bg-violet-100 w-7 h-7 items-center justify-center rounded-md'>
            <img src='../assets/images/KleoToken.svg' className='flex w-[24px] h-[24px]'/>
          </div>
          <div className='flex flex-row ml-2 mr-1'>
            <div className='font-medium text-sm text-violet-700'>
              {user.profile_metadata.kleo_points ? user.profile_metadata.kleo_points : 0}
            </div>
            <div className='flex font-light text-[10px] text-violet-500 ml-1 text-center items-center'>
              KLEO
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-[25px]">
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mx-auto">
            {activeCard.cardType == 'DataCard' && <div className="bg-white rounded-lg shadow-lg p-3 px-5 bg-violet-50 flex flex-col justify-between min-h-[desiredMinHeight] mt-[20px]">
              <header className="relative flex items-center">
                {activeCard.urls.map((urls, index) => (
                  <div className="w-6 h-6 flex-none rounded-full border border-white border-spacing-4 fill-white">
                    <img
                      className="absolute w-6 h-6 flex-none rounded-full border-white border-2 fill-white"
                      style={{ left: `${index * 1.3}rem` }}
                      src={`https://www.google.com/s2/favicons?domain=${urls.url}&sz=24`}
                    />
                  </div>
                ))}
                <div className="flex flex-row ml-auto items-center">
                  {/* <Arrow className="w-6 h-4 mr-1" /> */}
                  <div className="flex font-inter text-gray-400 font-normal">
                    {getDaysAgo(activeCard.date)}
                  </div>
                </div>
              </header>

              <div className="flex flex-col justify-center mt-1">
                <blockquote className="text-gray-600 text-base font-normal">
                  {activeCard.content}
                </blockquote>
              </div>


              <div className="flex flex-row w-full flex-wrap gap-2 self-stretch items-center justify-start pt-5">
                <>
                  {activeCard.urls.map((urls) => (
                    <button
                      className="flex items-center gap-2 rounded-3xl border border-gray-200 px-2 py-1 bg-gray-50"
                      onClick={() => handleOnClick(urls.url)}
                    >
                      <img
                        className="w-4 h-4 flex-none rounded-full"
                        src={`https://www.google.com/s2/favicons?domain=${urls.url}&sz=16`}
                      />

                      <h3 className="inline-block text-xs font-medium text-gray-700 overflow-hidden overflow-ellipsis line-clamp-1">
                        {activeCard.urls.length > 2 && urls.title.length > 10
                          ? urls.title.trim().slice(0, 10) + '...'
                          : urls.title.trim().slice(0, 25) + '...'}
                      </h3>
                    </button>
                  ))}
                </>
              </div>
            </div>}
            {activeCard.cardType == 'DomainVisitCard' && (
              <div className=" rounded-lg shadow-lg p-3 px-5 bg-[#42307D]  flex flex-col justify-between min-h-[200px] border border-white overflow-hidden bg-gradient-to-r from-violet-950 to-violet-900 mt-[20px]">
                {/* Header for card*/}
                <header className="relative flex flex-row items-center mt-3 justify-between">
                  <div className="flex flex-row items-center bg-opacity-50 backdrop-blur-md bg-white py-1 px-2 rounded-3xl">
                    {activeCard.urls.map((urls, index) => (
                      <img
                        className={` w-6 h-6 flex-none rounded-full fill-black`}
                        style={{ left: `${index * 1.3}rem` }}
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
                  <img src="../assets/images/backFrameDataCard.svg" className="absolute right-0 top-0 w-[204px] h-[189px] translate-x-20 -translate-y-10 z-10" />
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
            {activeCard.cardType == 'VisitChartCard' && (
              <VisitChartCard
                data={activeCard.metadata.activity}
                date={`${getDateAndMonth(activeCard.metadata.dateFrom)} - ${getDateAndMonth(
                  activeCard?.metadata?.dateTo
                )}`}
              />
            )}
          </div>
        </div>
        <div className='mt-auto'>
          <ProgressBar progress={Math.floor(((totalCardCount - cards.length) / totalCardCount) * 100)} />
        </div>
      </div>
      <div className="flex flex-row gap-2 my-[22px] mx-[24px]">
        <button
          onClick={() => removeCard(activeCard.id, false)}
          className="flex justify-center items-center w-[165px] px-3 py-2 rounded-lg bg-gray-100 text-[#363F72] font-semibold"
        >
          <img src='../assets/images/cross.svg' className='flex w-[13px] h-[9px] stroke-[#363F72] fill-[#363F72] mr-1'/>
          Delete
        </button>
        <button
          onClick={() => removeCard(activeCard.id, true)}
          className="flex justify-center items-center w-[165px] h-[44px] px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold"
        >
          <img src='../assets/images/check.svg' className='flex w-[13px] h-[9px] stroke-white fill-current mr-1'/>
          Publish
        </button>
      </div>
    </div>) : (
      <>
        <div className="flex flex-col justify-center items-center w-[400px] min-h-[448px] bg-[#FCFCFD]">
          <div className="flex flex-col justify-start items-center w-[380px] h-[428px] bg-gray-100 rounded-lg px-[16px] pb-[8px]">
            <div className='flex flex-row bg-white h-[38px] p-2 rounded-md items-center ml-auto mt-4'>
              <div className='flex my-[5px] bg-violet-100 w-7 h-7 items-center justify-center rounded-md'>
                <img src='../assets/images/KleoToken.svg' className='flex w-[24px] h-[24px]'/>
              </div>
              <div className='flex flex-row ml-2 mr-1'>
                <div className='font-medium text-sm text-violet-700'>
                  {user.profile_metadata.kleo_points ? user.profile_metadata.kleo_points : 0}
                </div>
                <div className='flex font-light text-[10px] text-violet-500 ml-1 text-center items-center'>
                  KLEO
                </div>
              </div>
            </div>
            <img src="../assets/images/spaceCat.svg" className="w-[157px] h-[152px]"/>
            <div className='text-gray-700 font-semibold text-[16px] mt-[4px]'>Yay! you are done for the day..</div>
            <div className='text-gray-500 font-normal text-[11px] mt-[4px]'>Come back tomorrow for new cards</div>
            <div className="bg-gray-50 rounded-lg shadow-lg flex flex-col justify-between min-w-[desiredMinWeight] min-h-[desiredMinHeight] mt-12">
                <CountdownTimer
                  endDate={convertEpochToISO(
                    user.last_cards_marked + 86400
                  )}
                  isProfilePage={false}
                />
              </div>
          </div>
        </div>  
      </>
    )}
    </>
  )
}
