interface DataCardBodyData {
  description: string
  data: string
  direction: string
}

export default function DataCardBody({
  description,
  data,
  direction
}: DataCardBodyData) {
  return (
    <div className="flex flex-col items-center justify-end self-stretch mt-4 font-medium flex-1 mb-2">
      <div className="flex flex-row items-center justify-start w-full h-[60px]">
        <span className="text-[57px] font-bold text-white text-center">{data}</span>
        <img src="../assets/images/arrowDataCard.svg" className={`w-[44px] h-[44px] ml-[7px] mt-1 items-center justify-center ${
            direction == 'increased' ? '' : 'rotate-180'
          }`} />
      </div>
      <span className="text-sm text-white font-normal">{description}</span>
    </div>
  )
}
