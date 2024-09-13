import { ReactElement, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { UserData } from './common/interface';
import Navbar from './navbar/Navbar';
import useFetch from './common/hooks/useFetch';
import RegisterKleo from './pages/ProfileCards/RegisterKleo';
import CardCreatedState from './pages/ProfileCards/RegisterKleo';
import ProfileCardsComponent from './pages/ProfileCards/ProfileCardComponent';
import { HomeComponent } from './pages/home/HomeComponent';

function App(): ReactElement {
  const emptyStringArray: string[] = [];
  const [slug, setSlug] = useState<string>('');
  const [user, setUser] = useState<UserData>({
    badges: emptyStringArray,
    content_tags: emptyStringArray,
    first_time_user: false,
    identity_tags: emptyStringArray,
    kleo_points: 88,
    data_quality: 87,
    last_minted: Math.floor(Date.now() / 1000),
    slug: '0xB344d8c2C1d3298Fe61da6fE8F4aEe4D18bED6e5',
    verified: false,
    total_data_quantity: 2, // this would be in MegaBytes, this is 34MB
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
            <Route path="/home" element={<HomeComponent user={user} />} />
          </Routes>
        </div>
      ) : (
        <RegisterKleo />
      )}
    </div>
  );
}

export default App;
