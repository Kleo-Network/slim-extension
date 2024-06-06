import { useState } from 'react'

interface NavbarProps {
  avatar: {
    src: string
    alt: string
  }
  slug: string
}

const Navbar = ({ avatar, slug }: NavbarProps) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false)

  function getUserProfile() {
    window.open(`https://www.app.kleo.network/profileV2/${slug}`, '_blank')
  }

  return (
    <nav
      className="relative flex w-full flex-wrap items-center justify-between bg-white h-[52px]"
    >
      <div className="flex flex-row w-full flex-wrap items-center justify-between px-[16px] py-[14px]">
        <div className="flex items-center justify-center text-neutral-900 hover:text-neutral-900">
          <img src="../assets/images/kleoLogo.svg" className="flex items-center w-[24px] h-[24px]" />
          <h3 className="font-bold text-base ml-2">KLEO</h3>
        </div>

        {/* <!-- Collapsible navigation container --> */}

        <div className="flex flex-row items-center ml-auto hover:cursor-pointer" onClick={getUserProfile}>
          <div
            className="relative flex items-center justify-center flex-grow"
          >
            <img
              src={avatar.src}
              alt={avatar.alt}
              className="w-[24px] h-[24px] rounded-full"
            />
          </div>
          <div className="text-gray-700 text-xs ml-2 font-medium">Profile</div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
