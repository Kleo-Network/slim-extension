import { UserData } from "../common/interface";
import { NameAndMintLinkComponent } from "./NameAndMintLinkComponent";

interface ProfileCardProps {
	user: UserData;
}

export const ProfileCardComponent = ({ user }: ProfileCardProps) => {
	return (
		<div className="w-[367px] h-[142px] bg-white rounded-lg p-4">
			<NameAndMintLinkComponent
				avatar={{ src: user.pfp, alt: "Profile" }}
				slug={user.slug}
				userName={user.name}
			/>
		</div>
	);
};
