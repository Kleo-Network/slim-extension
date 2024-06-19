import { useNavigate } from 'react-router-dom'

export default function CardCreatedState() {

    const navigate = useNavigate()

  const goBackToProfile = () => {
    console.log("hello there");
    navigate("/cards")
  } 

  return (
    <>
    <div className="flex flex-col justify-center items-center w-[400px] min-h-[448px] bg-[#FCFCFD]">
      <div className="flex flex-col justify-center items-center w-[368px] h-[345px] bg-gray-100 rounded-lg px-[16px] py-[8px]">
        <img src="../assets/images/cardCreated.svg" className="w-[157px] h-[152px]"/>
        <div className='text-gray-700 font-semibold text-[16px] mt-[4px]'>Yay! you are done for the day..</div>
        <div className='text-gray-500 font-normal text-[11px] mt-[4px]'>Come back tomorrow for new cards</div>
      </div>
      <div className="flex flex-row gap-2 my-[22px] mx-[24px]">
        <button
          onClick={() => goBackToProfile()}
          className="flex justify-center items-center w-[165px] h-[44px] px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold ml-[22px]"
        >
            Go Back To Profile
        </button>
      </div>
    </div>
    </>
  )
}

