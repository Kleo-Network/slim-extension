
export default function RegisterPopup() {

  const openKleo = () => {
    window.open('https://app.kleo.network', '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className="flex justify-center items-center w-[400px] min-h-[500px] bg-cover bg-center"
      style={{ backgroundImage: "url('../assets/images/bg_basic.png')" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className='text-gray-700 font-semibold text-[16px] mb-2'>Not Logged In / Signed up?</div>
        <div className='text-gray-500 font-normal text-[11px] mb-6'>Register or login on app.kleo.network</div>
        <button
          onClick={() => openKleo()}
          className="w-full h-[44px] px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold"
        >
          Register / Login 
        </button>
      </div>
    </div>
  )
}