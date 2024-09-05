import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  avatar: {
    src: string;
    alt: string;
  };
  slug: string;
}

const Navbar = ({ avatar, slug }: NavbarProps) => {
  const isProfilePage = useLocation().pathname.includes('profile');

  return (
    <nav className="relative flex w-full flex-wrap items-center justify-between bg-white h-[52px]">
      <div className="flex flex-row w-full flex-wrap items-center justify-between px-[16px] py-[14px]">
        <div className="flex items-center justify-center text-neutral-900 hover:text-neutral-900">
          <img src="../assets/images/kleoLogo.svg" className="flex items-center w-[24px] h-[24px]" />
          <h3 className="font-bold text-base ml-2">KLEO</h3>
        </div>

        {/* <!-- Collapsible navigation container --> */}
        <Link
          to={isProfilePage ? '/cards' : '/home'}
          className="flex flex-row items-center ml-auto hover:cursor-pointer"
        >
          <div className="relative flex items-center justify-center flex-grow">
            <img
              src={isProfilePage ? '../assets/images/cardsIconWithNotification.svg' : avatar.src}
              alt={isProfilePage ? 'Cards' : avatar.alt}
              className={`w-[24px] h-[24px] ${!isProfilePage ? 'rounded-full' : ''}`}
            />
          </div>
          <div className="text-gray-700 text-xs ml-2 font-medium">{isProfilePage ? 'Cards' : 'Profile'}</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
