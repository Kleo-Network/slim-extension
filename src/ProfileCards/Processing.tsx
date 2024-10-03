export default function Processing() {
    return (
      <div 
        className="flex flex-col justify-center items-center w-[400px] min-h-[500px] bg-cover bg-center"
        style={{ background: "#F8F9FC" }}
      >
        <div className="p-6 rounded-lg text-center">
          <img 
            src="../assets/images/process.png" 
            alt="Processing icon" 
           
          />
          <h2 className='text-[#1E2B3A] font-semibold text-[20px] mb-2'>
            We are processing your data
          </h2>
          <p className='text-[#64748B] font-normal text-[14px]'>
            It takes about 10 minutes for our LLM models<br />
            to create your activity graph.Your Kleo Points and Activity Graph will be visible shortly.
          </p>
        </div>
      </div>
    )
  }