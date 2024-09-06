import { UserData } from '../../common/interface';

interface HomeComponentProps {
  user: UserData;
}

const kleoCoinInContainerPath = '../assets/images/homeImages/kleoCoinInContainer.svg';

export const HomeComponent = ({ user }: HomeComponentProps) => {
  return (
    <div className="h-full w-full bg-gray-blue p-4">
      {/* Name + Kleo Points top bar */}
      <div className="flex justify-between items-center w-full h-[42px] bg-gray-600">
        <div className=""></div>
        {/* Button at the right end */}
        <div className="h-9 bg-white w-fit rounded-lg p-[6px] flex items-center justify-normal gap-2">
          <img src={kleoCoinInContainerPath} className="flex w-[24px] h-[24px]" />
          <div className="text-primary-btn-500 flex gap-1 mt-1">
            <span className="font-semibold text-sm">123</span>
            <span className="font-normal text-[8px] leading-6">KLEO XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
