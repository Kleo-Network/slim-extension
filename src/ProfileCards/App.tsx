import { useState, useEffect } from 'react'
import CountdownTimer from './countdown'
import { PendingCard, UserDataProps } from '../common/interface'
import useFetch from '../common/hooks/useFetch'

export default function App({ user, setUser, slug}: UserDataProps) {

  const emptyStringArray: string[] = []

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

  const removeCard = (id: string, hasToPublished: boolean) => {
    console.log(id)

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
    <div className="flex flex-col justify-center items-center w-[400px] max-h-[300px] bg-[#FCFCFD]">
      <div className="flex flex-col w-[368px] h-[345px] bg-gray-100 mt-16 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-2">
          <div className="flex flex-col md:flex-row justify-center items-stretch p-6 gap-4 mx-auto">
                <div className="flex-grow">
                  {activeCard.cardType == 'DataCard' && <div className="bg-white rounded-lg shadow-lg p-3 px-5 bg-violet-50 flex flex-col justify-between min-h-[desiredMinHeight]">
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
                      <blockquote className="text-gray-600 text-xs font-normal">
                        {activeCard.content}
                      </blockquote>
                    </div>


                    <div className="flex flex-row w-full flex-wrap gap-2 self-stretch items-center justify-start pt-5">
                      <>
                        {activeCard.urls.map((urls) => (
                          <button
                            className="flex items-center gap-2 rounded-3xl border border-gray-200 px-2 py-1 bg-gray-50"
                            style={{
                              backgroundColor: '#fff'
                            }}
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
                  
                </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 my-[22px] mx-[24px]">
        <button
          onClick={() => removeCard(activeCard.id, false)}
          className="flex justify-center items-center w-[165px] px-3 py-2 rounded-lg bg-gray-100 text-[#363F72] font-semibold"
        >
          {/* <Cross className="w-8 stroke-white fill-white" /> */}
          Delete
        </button>
        <button
          onClick={() => removeCard(activeCard.id, true)}
          className="flex justify-center items-center w-[165px] px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold ml-[22px]"
        >
          {/* <Tick className="w-8 stroke-white fill-white" /> */}
          Publish
        </button>
      </div>
    </div>) : (
      cards.length <= 0 && (
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-lg p-3 px-5 bg-violet-50 flex flex-col justify-between min-h-[desiredMinHeight]">
            <CountdownTimer
              endDate={convertEpochToISO(
                user.last_cards_marked + 86400
              )}
              isProfilePage={false}
            />
          </div>
        </div>
      )
    )}
    </>
  )
}

export function convertEpochToISO(epoch: number): string {
  const date = new Date(epoch * 1000) // Convert seconds to milliseconds
  const isoString = date.toISOString() // Get ISO 8601 string in UTC timezone
  return isoString
}
