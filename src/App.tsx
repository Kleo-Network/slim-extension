import { ReactElement, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { UserData } from './common/interface';
import Navbar from './navbar/Navbar';
import useFetch from './common/hooks/useFetch';
import RegisterKleo from './pages/ProfileCards/RegisterKleo';
import CardCreatedState from './pages/ProfileCards/RegisterKleo';
import ProfileCardsComponent from './pages/ProfileCards/ProfileCardComponent';

function App(): ReactElement {
  const emptyStringArray: string[] = [];
  const [slug, setSlug] = useState<string>('');
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
    token: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get('user_id', (storageData) => {
      if (storageData.user_id) {
        setSlug(storageData.user_id.id);
      }
    });
    navigate('/home');
  }, []);

  const GET_USER_DETAIL = 'user/get-user/{slug}';
  const { fetchData: fetchUserData } = useFetch<UserData>();

  function getUserDetails(slug: string) {
    return GET_USER_DETAIL.replace('{slug}', slug);
  }

  useEffect(() => {
    try {
      fetchUserData(getUserDetails(slug), {
        onSuccessfulFetch(data) {
          if (data) {
            setUser(data);
          }
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [slug]);

  return (
    <div className="h-[500px] w-[400px] rounded-xl bg-gray-50">
      {slug !== '' ? (
        <div className="flex flex-col font-inter self-stretch h-full rounded-xl">
          <header className="flex flex-row self-stretch items-center">
            <Navbar slug={user.slug} />
          </header>

          <Routes>
            <Route path="/card-created" element={<CardCreatedState />} />
            <Route path="/cards" element={<ProfileCardsComponent user={user} setUser={setUser} slug={slug} />} />
            {/* <Route path="/home" element={<HomeComponent user={user} slug={slug} />} /> */}
          </Routes>
        </div>
      ) : (
        <RegisterKleo />
      )}
    </div>
  );
}

export default App;
