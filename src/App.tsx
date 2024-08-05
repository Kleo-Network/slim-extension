import { ReactElement, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom'
import { UserData } from './common/interface'
import Navbar from './navbar/Navbar'
import ProfileCards from './ProfileCards/App'
import useFetch from './common/hooks/useFetch'
import CardCreatedState from './ProfileCards/CardCreatedState'
import { LeaderBoardComponent } from './LeaderBoardComponent/LeaderBoardComponent'

function App(): ReactElement {
  const emptyStringArray: string[] = []
  const [slug, setSlug]= useState<string>('')
  const [user, setUser] = useState<UserData>({
    about: '',
    badges: emptyStringArray,
    content_tags: emptyStringArray,
    identity_tags: emptyStringArray,
    last_attested: Math.floor(Date.now() / 1000),
    last_cards_marked: Math.floor(Date.now() / 1000),
    name: 'Kleo User',
    pfp: 'https://pbs.twimg.com/profile_images/1590877918015926272/Xl2Bd-X2_400x400.jpg',
    profile_metadata: {},
    settings: {},
    slug: '',
    stage: 1,
    verified: false,
    email: '',
    token: ''
  })
  const navigate = useNavigate()


  useEffect(() => {
    chrome.storage.local.get('user_id', storageData => {
      console.log(storageData.user_id);
      if(storageData.user_id) {
        setSlug(storageData.user_id.id)
      }
    });
    navigate("/profile")
  }, []);

  const GET_USER_DETAIL = 'user/get-user/{slug}'
  const { fetchData: fetchUserData } = useFetch<UserData>()

  function getUserDetails(slug: string) {
    return GET_USER_DETAIL.replace('{slug}', slug)
  }

  useEffect(() => {
    try {
      fetchUserData(getUserDetails(slug), {
        onSuccessfulFetch(data) {
          if (data) {
            setUser(data)
          }
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [slug])

  return (
      <div className="h-[500px] w-[400px] rounded-xl bg-gray-50">
        <div className="flex flex-col font-inter self-stretch h-full rounded-xl">
            <header className="flex flex-row self-stretch items-center">
              <Navbar
                avatar={{ src: user.pfp, alt: 'Profile' }}
                slug={user.slug}
              />
            </header>
      
          <Routes>
            <Route
              path="/card-created"
              element={<CardCreatedState/>}
            />
            <Route
              path="/cards"
              element={<ProfileCards user={user} setUser={setUser} slug={slug}/>}
            />
            <Route
              path="/profile"
              element={<LeaderBoardComponent user={user} slug={slug}/>}
            />
          </Routes>
        </div>
      </div>
  )
}

export default App