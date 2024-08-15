import { useState, useEffect } from "react";
import CountdownTimer from "./countdown";
import purpleCardBg from "../assets/images/purpleCardBg.png";
import {
	CardTypeToRender,
	PendingCard,
	UserDataProps,
} from "../common/interface";
import useFetch from "../common/hooks/useFetch";
import ProgressBar from "../progressBar/progressBar";
import DataCardBody from "./DataCardBody";
import VisitChartCard from "./VisitChartCard";
import { useNavigate } from "react-router-dom";
import {
	convertEpochToISO,
	getDateAndMonth,
	getDaysAgo,
	parseUrl,
	replaceSlugInURL,
	updateCardTypeToRenderInAllCards,
} from "../common/utils";
import { YTCardBody } from "./YTCardBody";
import { ImageCard } from "./ImageCard";

const GET_CARD_DETAIL = "cards/pending/{slug}";
const CREATE_PUBLISHED_CARDS = "cards/published/{slug}";

const dummyPendingCards: PendingCard[] = [
	{
		cardType: "DataCard",
		category: "Technology",
		content:
			"PrinceTesting explored design tools and systems to enhance collaborative workflows.",
		date: 12345678,
		id: "66bd7789b379664c576c5625",
		metadata: {
			activity: "explored",
			description:
				"PrinceTesting explored design tools and systems to enhance collaborative workflows.",
			tags: ["design", "collaboration"],
			titles: ["Figma", "KLEO Design system – Figma"],
		},
		minted: false,
		tags: ["design", "collaboration"],
		urls: [
			{
				id: "66bcd2f34b27fc3a2fe537ef",
				title: "Figma",
				url: "https://www.figma.com/design/JN3XzNNAqf1HeH1B0x4sl6/KLEO-Design-system?node-id=1883-2388&t=TJdQt9aIgVl3qO3G-0",
			},
			{
				id: "66bcd2f4bbc9af57a8e53828",
				title: "KLEO Design system – Figma",
				url: "https://www.figma.com/design/JN3XzNNAqf1HeH1B0x4sl6/KLEO-Design-system?t=l78GYUVXt3LkEkCG-0",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Technology",
		content:
			"PrinceTesting was interested in designing and refining user interfaces.",
		date: 12345678,
		id: "66bd778b1147ab5778895ef5",
		metadata: {
			activity: "designed",
			description:
				"PrinceTesting was interested in designing and refining user interfaces.",
			tags: ["Design", "UI/UX"],
			titles: ["Figma", "KLEO Design system – Figma"],
		},
		minted: false,
		tags: ["Design", "UI/UX"],
		urls: [
			{
				id: "66bcd2f34b27fc3a2fe537ef",
				title: "Figma",
				url: "https://www.figma.com/design/JN3XzNNAqf1HeH1B0x4sl6/KLEO-Design-system?node-id=1883-2388&t=TJdQt9aIgVl3qO3G-0",
			},
			{
				id: "66bcd2f4bbc9af57a8e53828",
				title: "KLEO Design system – Figma",
				url: "https://www.figma.com/design/JN3XzNNAqf1HeH1B0x4sl6/KLEO-Design-system?t=l78GYUVXt3LkEkCG-0",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Miscellaneous",
		content:
			"PrinceTesting explored Gemini to understand the astrological traits and personality attributes associated with the zodiac sign Gemini.",
		date: 12345678,
		id: "66bd77931147ab5778895ef6",
		metadata: {
			activity: "explored",
			description:
				"PrinceTesting explored Gemini to understand the astrological traits and personality attributes associated with the zodiac sign Gemini.",
			tags: ["astrology", "personality"],
			titles: ["Gemini"],
		},
		minted: false,
		tags: ["astrology", "personality"],
		urls: [
			{
				id: "66bce7e3f375d328c7c674fb",
				title: "Gemini",
				url: "https://gemini.google.com/app",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Entertainment",
		content:
			"PrinceTesting explored Disney+ Hotstar for its extensive library of TV shows and movies.",
		date: 12345678,
		id: "66bd77b81147ab5778895ef7",
		metadata: {
			activity: "streamed",
			description:
				"PrinceTesting explored Disney+ Hotstar for its extensive library of TV shows and movies.",
			tags: ["TV Shows", "Movies"],
			titles: [
				"Disney+ Hotstar - Watch TV Shows, Movies, Specials, Live Cricket & Football",
				"Watch - Disney+ Hotstar",
			],
		},
		minted: false,
		tags: ["TV Shows", "Movies"],
		urls: [
			{
				id: "66baf4c21aa3a236744dcdbf",
				title:
					"Disney+ Hotstar - Watch TV Shows, Movies, Specials, Live Cricket & Football",
				url: "https://www.hotstar.com/in/onboarding/profile?ref=%2Fin%2Fmovies%2Fkingdom-of-the-planet-of-the-apes%2F1271324090%2Fwatch",
			},
			{
				id: "66baf5cd17829dd84c4dcf1f",
				title: "Watch - Disney+ Hotstar",
				url: "https://www.hotstar.com/in/movies/kingdom-of-the-planet-of-the-apes/1271324090/watch",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Lifestyle",
		content:
			"Explored and purchased various electronic products from Croma's online platform.",
		date: 12345678,
		id: "66bd77c089f14406e7f8d621",
		metadata: {
			activity: "shopped",
			description:
				"Explored and purchased various electronic products from Croma's online platform.",
			tags: ["electronics", "online shopping"],
			titles: [
				"Croma Electronics | Online Electronics Shopping | Buy Electronics Online",
				"My Account Page | Croma Electronics | Online Electronics Shopping | Buy Electronics Online",
			],
		},
		minted: false,
		tags: ["electronics", "online shopping"],
		urls: [
			{
				id: "66bbc24fd1ecc6f159fe4595",
				title:
					"Croma Electronics | Online Electronics Shopping | Buy Electronics Online",
				url: "https://www.croma.com/",
			},
			{
				id: "66bbc2509afe497622fe452e",
				title:
					"My Account Page | Croma Electronics | Online Electronics Shopping | Buy Electronics Online",
				url: "https://www.croma.com/my-account/myOrderExpanded",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Technology",
		content:
			"Explored authorization processes and verified sessions for secure access on GitHub.",
		date: 12345678,
		id: "66bd77d489f14406e7f8d622",
		metadata: {
			activity: "reviewed",
			description:
				"Explored authorization processes and verified sessions for secure access on GitHub.",
			tags: ["GitHub", "Authorization"],
			titles: ["Verify Session", "OAuth application authorized"],
		},
		minted: false,
		tags: ["GitHub", "Authorization"],
		urls: [
			{
				id: "66bbc5489afe497622fe47ec",
				title: "Verify Session",
				url: "https://github.com/login/oauth/select_account?client_id=de0e3c7e9973e1c4dd77&scope=repo+user+workflow&state=530c419a-f8b3-41fa-8d6d-e41b76190039",
			},
			{
				id: "66bbc549ea29532991fe4787",
				title: "OAuth application authorized",
				url: "https://github.com/login/oauth/authorize?client_id=de0e3c7e9973e1c4dd77&scope=repo+user+workflow&skip_account_picker=true&state=530c419a-f8b3-41fa-8d6d-e41b76190039",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Technology",
		content:
			"PrinceTesting explored various design systems and tools to enhance user interface development.",
		date: 12345678,
		id: "66bb296189f14406e7f8d5f2",
		metadata: {
			activity: "explored",
			description:
				"PrinceTesting explored various design systems and tools to enhance user interface development.",
			tags: ["design", "system"],
			titles: ["KLEO Design system – Figma", "Figma"],
		},
		minted: false,
		tags: ["design", "system"],
		urls: [
			{
				id: "66ba2bd458b344bf2391d12a",
				title: "KLEO Design system – Figma",
				url: "https://www.figma.com/design/JN3XzNNAqf1HeH1B0x4sl6/KLEO-Design-system?node-id=1881-2562&t=flA4ml3GMA8WzbsS-0",
			},
			{
				id: "66ba2eb69051ab4433c4dd39",
				title: "Figma",
				url: "https://www.figma.com/design/JN3XzNNAqf1HeH1B0x4sl6/KLEO-Design-system?node-id=29-7828&t=flA4ml3GMA8WzbsS-0",
			},
		],
	},
	{
		cardType: "DataCard",
		category: "Miscellaneous",
		content:
			"PrinceTesting enjoyed watching English dubbed episodes of Dororo online.",
		date: 12345678,
		id: "66bb29761147ab5778895ec7",
		metadata: {
			activity: "watched",
			description:
				"PrinceTesting enjoyed watching English dubbed episodes of Dororo online.",
			tags: ["anime", "entertainment"],
			titles: [
				"Dororo Episode 23 English Dubbed - Watch Anime in English Dubbed Online",
				"Dororo Episode 24 English Dubbed - Watch Anime in English Dubbed Online",
				"Watch Anime English Dubbed Online for Free",
			],
		},
		minted: false,
		tags: ["anime", "entertainment"],
		urls: [
			{
				id: "66ba2f8345e8d4a00dc4e03d",
				title:
					"Dororo Episode 23 English Dubbed - Watch Anime in English Dubbed Online",
				url: "https://www.wcoanimedub.tv/dororo-episode-23-english-dubbed",
			},
			{
				id: "66ba2fc76fb3dd3c6dc4e1b3",
				title:
					"Dororo Episode 24 English Dubbed - Watch Anime in English Dubbed Online",
				url: "https://www.wcoanimedub.tv/dororo-episode-24-english-dubbed",
			},
			{
				id: "66ba30002af85708aac4e2b4",
				title: "Watch Anime English Dubbed Online for Free",
				url: "https://www.wcoanimedub.tv/",
			},
		],
	},
];

export default function App({ user, setUser, slug }: UserDataProps) {
	const navigate = useNavigate();

	// to fetch pending cards
	const [totalCardCount, setTotalCardCount] = useState(0);
	const [cards, setCards] = useState<PendingCard[]>([]);
	const [activeCardList, setActiveCardList] = useState<PendingCard[]>([]);
	const [activeCard, setActiveCard] = useState<PendingCard>(activeCardList[0]);

	// Fetch Pending Cards
	const { fetchData: fetchPendingCardData } = useFetch<PendingCard[]>();
	useEffect(() => {
		const fetchData = async () => {
			try {
				fetchPendingCardData(replaceSlugInURL(GET_CARD_DETAIL, slug), {
					onSuccessfulFetch(data) {
						if (data) {
							data.push(...dummyPendingCards);
							data = updateCardTypeToRenderInAllCards(data);
							setCards(data);
							setActiveCardList(data);
							setActiveCard(data[0]);
							setTotalCardCount(data.length);
							chrome.runtime.sendMessage({
								type: "UPDATE_NOTIFICATION_COUNTER",
								counter: data.length,
							});
						}
					},
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [slug]);

	// Remove Card
	const { fetchData: managePendingCardCreation } = useFetch<any>();
	const removeCard = (id: string, hasToPublished: boolean) => {
		console.log(id);
		if (hasToPublished) {
			user.profile_metadata.kleo_points++;
		}

		managePendingCardCreation(replaceSlugInURL(CREATE_PUBLISHED_CARDS, slug), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id,
				isPublishCard: hasToPublished,
			}),
		});

		setCards((cards) => cards.filter((card) => card.id !== id));
		setActiveCardList((activeCardList) =>
			activeCardList.filter((card) => card.id !== id)
		);
		const active = activeCardList.filter((card) => card.id !== id)[0];
		setActiveCard(active);
		chrome.runtime.sendMessage({
			type: "UPDATE_NOTIFICATION_COUNTER",
			counter: cards.length - 1,
		});
		if (cards.length - 1 === 0) {
			navigate("/card-created");
		}
	};

	const handleOnClick = (url: string) => window.open(url, "_blank");

	return (
		<>
			{activeCardList.length > 0 ? (
				<div className="flex flex-col justify-center items-center w-[400px] max-h-[448px] bg-[#FCFCFD] mt-[16px]">
					<div className="flex flex-col justify-center items-center w-[368px] h-[345px] bg-gray-100 rounded-lg px-[16px] py-[8px]">
						{/* KLEO points in top right corner */}
						<div className="flex flex-row bg-white h-[38px] p-2 rounded-md items-center ml-auto mt-1">
							<div className="flex my-[5px] bg-violet-100 w-7 h-7 items-center justify-center rounded-md">
								<img
									src="../assets/images/KleoToken.svg"
									className="flex w-[24px] h-[24px]"
								/>
							</div>
							<div className="flex flex-row ml-2 mr-1">
								<div className="font-medium text-sm text-violet-700">
									{user.profile_metadata.kleo_points
										? user.profile_metadata.kleo_points
										: 0}
								</div>
								<div className="flex font-light text-[10px] text-violet-500 ml-1 text-center items-center">
									KLEO
								</div>
							</div>
						</div>

						{/* Actual Card with all Data */}
						<div className="flex flex-col md:flex-row justify-between items-center mb-[25px] mt-[16px]">
							<div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mx-auto">
								{/* CardType == DATA CARD */}
								{activeCard.cardType == "DataCard" && (
									<div
										className={`rounded-lg shadow-lg p-3 px-5 flex flex-col justify-between min-h-[desiredMinHeight] max-h-[230px] gap-2 ${
											activeCard.cardTypeToRender === CardTypeToRender.YT
												? "bg-yt-card"
												: "bg-white"
										}`}
										style={
											activeCard.cardTypeToRender === CardTypeToRender.PURPLE
												? {
														backgroundImage: `url('../assets/images/purpleCardBg.png')`,
												  }
												: {}
										}
									>
										{/* Body for YT card */}
										{activeCard.cardTypeToRender == CardTypeToRender.YT && (
											<YTCardBody card={activeCard} />
										)}

										{/* Header with favicons and date. */}
										<header className="relative flex items-center">
											{/* Map over all urls and show the favicon */}
											{Array.from(
												new Set(
													activeCard.urls.map(
														(url) =>
															`https://www.google.com/s2/favicons?domain=${parseUrl(
																url.url
															)}&sz=40`
													)
												)
											).map((iconUrl, index) => (
												<div
													key={iconUrl}
													className="w-6 h-6 flex-none rounded-full border-spacing-4"
												>
													<img
														className={`absolute w-6 h-6 flex-none rounded-full border-2 ${
															activeCard.cardTypeToRender ===
															CardTypeToRender.PURPLE
																? "border-purple-card fill-purple-card"
																: "border-white fill-white"
														}`}
														style={{
															left: `${index * 1.3}rem`,
														}}
														src={iconUrl}
													/>
												</div>
											))}
											<div className="flex flex-row ml-auto items-center">
												<div
													className={`flex font-inter text-sm ${
														activeCard.cardTypeToRender ===
														CardTypeToRender.PURPLE
															? "text-white"
															: "text-gray-400"
													} font-normal`}
												>
													{getDaysAgo(activeCard.date)}
												</div>
											</div>
										</header>

										{/* Card Content */}
										<div className="flex flex-col justify-center mt-1">
											<blockquote
												className={`text-base font-normal ${
													activeCard.cardTypeToRender === CardTypeToRender.YT ||
													activeCard.cardTypeToRender ===
														CardTypeToRender.PURPLE
														? "text-white"
														: "text-gray-600"
												}`}
											>
												{activeCard.content.length > 60
													? `${activeCard.content.slice(0, 60)}...`
													: activeCard.content}
											</blockquote>
										</div>

										{/* URL pills in bottom */}
										{(activeCard.cardTypeToRender == CardTypeToRender.DATA ||
											activeCard.cardTypeToRender ==
												CardTypeToRender.PURPLE) && (
											<div className="flex flex-row w-full flex-wrap gap-2 self-stretch items-center justify-start pt-5">
												<>
													{activeCard.urls.map((urls) => (
														<button
															className={`flex items-center gap-2 rounded-3xl border px-2 py-1 ${
																activeCard.cardTypeToRender ==
																CardTypeToRender.PURPLE
																	? "border-none bg-white/20"
																	: "border-gray-200 bg-gray-50"
															}`}
															onClick={() => handleOnClick(urls.url)}
														>
															<img
																className="w-4 h-4 flex-none rounded-full"
																src={`https://www.google.com/s2/favicons?domain=${urls.url}&sz=16`}
															/>

															<h3
																className={`inline-block text-xs font-medium ${
																	activeCard.cardTypeToRender ==
																	CardTypeToRender.PURPLE
																		? "text-white"
																		: "text-gray-700"
																} overflow-hidden overflow-ellipsis line-clamp-1`}
															>
																{activeCard.urls.length > 2 &&
																urls.title.length > 10
																	? urls.title.trim().slice(0, 10) + "..."
																	: urls.title.trim().slice(0, 25) + "..."}
															</h3>
														</button>
													))}
												</>
											</div>
										)}
									</div>
								)}

								{activeCard.cardType == "ImageCard" && (
									<ImageCard card={activeCard} />
								)}

								{/* CardType == DOMAIN VISITED CARD */}
								{activeCard.cardType == "DomainVisitCard" && (
									<div className=" rounded-lg shadow-lg p-3 px-5 bg-[#42307D]  flex flex-col justify-between min-h-[200px] border border-white overflow-hidden bg-gradient-to-r from-violet-950 to-violet-900 mt-[20px]">
										{/* Header for card*/}
										<header className="relative flex flex-row items-center mt-3 justify-between">
											<div className="flex flex-row items-center bg-opacity-50 backdrop-blur-md bg-white py-1 px-2 rounded-3xl">
												{activeCard.urls.map((urls, index) => (
													<img
														className={` w-6 h-6 flex-none rounded-full fill-black`}
														style={{
															left: `${index * 1.3}rem`,
														}}
														src={`https://www.google.com/s2/favicons?domain=${urls.url}`}
													/>
												))}
												<div className="font-inter font-medium text-sm text-white ml-2">
													{parseUrl(activeCard.urls[0].url)}
												</div>
											</div>
											<div className="flex flex-row items-center justify-center mr-1 ml-auto py-[2px] text-white font-inter text-sm font-normal">
												{activeCard.tags[2]}
											</div>
											<img
												src="../assets/images/backFrameDataCard.svg"
												className="absolute right-0 top-0 w-[204px] h-[189px] translate-x-20 -translate-y-10 z-10"
											/>
										</header>

										{/* Body for feed card */}
										{activeCard.cardType == "DomainVisitCard" && (
											<DataCardBody
												data={activeCard.metadata.activity[0]}
												description={activeCard.content}
												direction={activeCard.metadata.activity[1]}
											/>
										)}
									</div>
								)}

								{/* CardType == VISIT CHART CARD */}
								{activeCard.cardType == "VisitChartCard" && (
									<VisitChartCard
										data={activeCard.metadata.activity}
										date={`${getDateAndMonth(
											activeCard.metadata.dateFrom
										)} - ${getDateAndMonth(activeCard?.metadata?.dateTo)}`}
									/>
								)}
							</div>
						</div>

						{/* Progress Bar */}
						<div className="mt-auto">
							<ProgressBar
								progress={Math.floor(
									((totalCardCount - cards.length) / totalCardCount) * 100
								)}
							/>
						</div>
					</div>

					{/* Delete and Publish Buttons  */}
					<div className="flex flex-row gap-2 my-[22px] mx-[24px]">
						<button
							onClick={() => removeCard(activeCard.id, false)}
							className="flex justify-center items-center w-[165px] px-3 py-2 rounded-lg bg-gray-100 text-[#363F72] font-semibold"
						>
							<img
								src="../assets/images/cross.svg"
								className="flex w-[13px] h-[9px] stroke-[#363F72] fill-[#363F72] mr-1"
							/>
							Delete
						</button>
						<button
							onClick={() => removeCard(activeCard.id, true)}
							className="flex justify-center items-center w-[165px] h-[44px] px-3 py-2 rounded-lg bg-violet-600 text-white font-semibold"
						>
							<img
								src="../assets/images/check.svg"
								className="flex w-[13px] h-[9px] stroke-white fill-current mr-1"
							/>
							Publish
						</button>
					</div>
				</div>
			) : (
				<>
					<div className="flex flex-col justify-center items-center w-[400px] min-h-[448px] bg-[#FCFCFD]">
						<div className="flex flex-col justify-start items-center w-[380px] h-[428px] bg-gray-100 rounded-lg px-[16px] pb-[8px]">
							<div className="flex flex-row bg-white h-[38px] p-2 rounded-md items-center ml-auto mt-4">
								<div className="flex my-[5px] bg-violet-100 w-7 h-7 items-center justify-center rounded-md">
									<img
										src="../assets/images/KleoToken.svg"
										className="flex w-[24px] h-[24px]"
									/>
								</div>
								<div className="flex flex-row ml-2 mr-1">
									<div className="font-medium text-sm text-violet-700">
										{user.profile_metadata.kleo_points
											? user.profile_metadata.kleo_points
											: 0}
									</div>
									<div className="flex font-light text-[10px] text-violet-500 ml-1 text-center items-center">
										KLEO
									</div>
								</div>
							</div>
							<img
								src="../assets/images/spaceCat.svg"
								className="w-[157px] h-[152px]"
							/>
							<div className="text-gray-700 font-semibold text-[16px] mt-[4px]">
								Yay! you are done for the day..
							</div>
							<div className="text-gray-500 font-normal text-[11px] mt-[4px]">
								Come back tomorrow for new cards
							</div>
							<div className="bg-gray-50 rounded-lg shadow-lg flex flex-col justify-between min-w-[desiredMinWeight] min-h-[desiredMinHeight] mt-12">
								<CountdownTimer
									endDate={convertEpochToISO(user.last_cards_marked + 86400)}
									isProfilePage={false}
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
