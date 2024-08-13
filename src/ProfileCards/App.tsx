import { useState, useEffect } from "react";
import CountdownTimer from "./countdown";
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

export const DummyYTCards: PendingCard[] = [
	// 4 Links
	{
		cardType: "DataCard",
		category: "Media & Communication",
		content:
			"Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.",
		date: 1723398081,
		id: "66b6c16e60f6a6a41aaf74b5",
		metadata: {
			activity: "researched",
			description: "Watched Daily Dose of Internet videos.",
			tags: ["technology", "support"],
			titles: [
				"Never Prank Your Barber",
				"How Does This Keep Happening",
				"This Delivery Guy is Built Different",
				"Criminal Pulls Off a Big Brain Move",
			],
		},
		minted: false,
		tags: ["technology", "support"],
		urls: [
			{
				id: "66b3e42df7ec5d4fd769f6fe",
				title: "Never Prank Your Barber",
				url: "https://www.youtube.com/watch?v=uDcb12CqoR4",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9af",
				title: "How Does This Keep Happening",
				url: "https://www.youtube.com/watch?v=W3xkS9lgYcw",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9ag",
				title: "This Delivery Guy is Built Different",
				url: "https://www.youtube.com/watch?v=GDRyigWvUFg",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9ah",
				title: "Criminal Pulls Off a Big Brain Move",
				url: "https://www.youtube.com/watch?v=99GVtAcV70c",
			},
		],
	},
	// 3 Links
	{
		cardType: "DataCard",
		category: "Media & Communication",
		content:
			"Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.",
		date: 1723398081,
		id: "66b6c16e60f6a6a41aaf74b6",
		metadata: {
			activity: "watched",
			description: "Watched Daily Dose of Internet videos.",
			tags: ["technology", "support"],
			titles: [
				"Never Prank Your Barber",
				"How Does This Keep Happening",
				"This Delivery Guy is Built Different",
			],
		},
		minted: false,
		tags: ["technology", "support"],
		urls: [
			{
				id: "66b3e42df7ec5d4fd769f6fe",
				title: "Never Prank Your Barber",
				url: "https://www.youtube.com/watch?v=W3xkS9lgYcw",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9af",
				title: "How Does This Keep Happening",
				url: "https://www.youtube.com/watch?v=uDcb12CqoR4",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9ag",
				title: "This Delivery Guy is Built Different",
				url: "https://www.youtube.com/watch?v=GDRyigWvUFg",
			},
		],
	},
	// 2 Links
	{
		cardType: "DataCard",
		category: "Media & Communication",
		content:
			"Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.",
		date: 1723398081,
		id: "66b6c16e60f6a6a41aaf74b7",
		metadata: {
			activity: "watched",
			description: "Watched Daily Dose of Internet videos.",
			tags: ["technology", "support"],
			titles: ["Never Prank Your Barber", "How Does This Keep Happening"],
		},
		minted: false,
		tags: ["technology", "support"],
		urls: [
			{
				id: "66b3e42df7ec5d4fd769f6fe",
				title: "Never Prank Your Barber",
				url: "https://www.youtube.com/watch?v=GDRyigWvUFg",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9af",
				title: "How Does This Keep Happening",
				url: "https://www.youtube.com/watch?v=W3xkS9lgYcw",
			},
		],
	},
	// 1 Links
	{
		cardType: "DataCard",
		category: "Media & Communication",
		content:
			"Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.Watched Daily Dose of Internet videos.",
		date: 1723398081,
		id: "66b6c16e60f6a6a41aaf74b8",
		metadata: {
			activity: "watched",
			description: "Watched Daily Dose of Internet videos.",
			tags: ["technology", "support"],
			titles: ["Never Prank Your Barber"],
		},
		minted: false,
		tags: ["technology", "support"],
		urls: [
			{
				id: "66b3e42df7ec5d4fd769f6fe",
				title: "Never Prank Your Barber",
				url: "https://www.youtube.com/watch?v=99GVtAcV70c",
			},
		],
	},
];
const DummyImageCards: PendingCard[] = [
	{
		cardType: "ImageCard",
		stockImage:
			"https://s3-alpha-sig.figma.com/img/6254/b4dc/06fd0000548177cb2e134eae14c08b46?Expires=1724630400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Rl7gXTLt8zE-fJqqQU8Y2VjT9XIQCFMjGiu2vutJiNKuJACcgOk-YVqutLDfc1rXcvIYb0DCvbiYYTKijcXNcdlJ--poaa7IsB~1fIUrS9TKabsKiAfXxz9vJrhX-He6aRcT19-PpQEBOujPPQHzojHVUi19oILtpfE2Vtns66LzWhoScYgIeEqIL1ooZCIL-pJm9L43redAHnMewkvKswH5ZK5SwYjqXbyZ-xy2Su8LmgRfyQ4pX6ub0dAtdQfdYZZxl3m-50U-J~kongZSfZwzx0rosskiqXKD9p2lJwGcWkhaXSqxdf~tmEMg9JvPoT6PZ0-70toUWtzWc9JwZw__",
		category: "Media & Communication",
		content:
			"PrinceTesting researched methods to bulk export iCloud Notes, likely due to a need for data backup or migration.",
		date: 1723398081,
		id: "abcdefghijklm",
		metadata: {
			activity: "researched",
			description:
				"PrinceTesting researched methods to bulk export iCloud Notes, likely due to a need for data backup or migration.",
			tags: ["technology", "support"],
			titles: [
				"How to Bulk Export all of your iCloud Notes from Apple : r/applehelp",
				"Notes “App” just Randomly Deleted Everything without a trace. How??? : r/applehelp",
			],
		},
		minted: false,
		tags: ["technology", "support"],
		urls: [
			{
				id: "66b3e42df7ec5d4fd769f6fd",
				title:
					"Notes “App” just Randomly Deleted Everything without a trace. How??? : r/applehelp",
				url: "https://www.reddit.com/r/applehelp/comments/17b1xu4/notes_app_just_randomly_deleted_everything/",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9a1",
				title:
					"How to Bulk Export all of your iCloud Notes from Apple : r/applehelp",
				url: "https://www.reddit.com/r/applehelp/comments/wdtw2f/how_to_bulk_export_all_of_your_icloud_notes_from/",
			},
		],
	},
	{
		cardType: "ImageCard",
		stockImage:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTa0UC7N0Wewy6S024ujjHi8p_RY1VYFXhbw&s",
		category: "Media & Communication",
		content:
			"Watched Game Of Thrones Season 6 Episode 5-9.Watched Game Of Thrones Season 6 Episode 5-9.Watched Game Of Thrones Season 6 Episode 5-9.Watched Game Of Thrones Season 6 Episode 5-9.",
		date: 1723678081,
		id: "abcdefghijklmnop",
		metadata: {
			activity: "researched",
			description:
				"PrinceTesting researched methods to bulk export iCloud Notes, likely due to a need for data backup or migration.",
			tags: ["technology", "support"],
			titles: [
				"How to Bulk Export all of your iCloud Notes from Apple : r/applehelp",
				"Notes “App” just Randomly Deleted Everything without a trace. How??? : r/applehelp",
			],
		},
		minted: false,
		tags: ["technology", "support"],
		urls: [
			{
				id: "66b3e42df7ec5d4fd769f6fd",
				title:
					"Notes “App” just Randomly Deleted Everything without a trace. How??? : r/applehelp",
				url: "https://www.reddit.com/r/applehelp/comments/17b1xu4/notes_app_just_randomly_deleted_everything/",
			},
			{
				id: "66b3e47ef7ec5d4fd769f9a1",
				title:
					"How to Bulk Export all of your iCloud Notes from Apple : r/applehelp",
				url: "https://www.reddit.com/r/applehelp/comments/wdtw2f/how_to_bulk_export_all_of_your_icloud_notes_from/",
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
							data.push(...DummyYTCards);
							data.push(...DummyImageCards);
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
														className="absolute w-6 h-6 flex-none rounded-full border-white border-2 fill-white"
														style={{
															left: `${index * 1.3}rem`,
														}}
														src={iconUrl}
													/>
												</div>
											))}
											<div className="flex flex-row ml-auto items-center">
												<div className="flex font-inter text-sm text-gray-400 font-normal">
													{getDaysAgo(activeCard.date)}
												</div>
											</div>
										</header>

										{/* Card Content */}
										<div className="flex flex-col justify-center mt-1">
											<blockquote
												className={`text-base font-normal ${
													activeCard.cardTypeToRender === CardTypeToRender.YT
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
										{activeCard.cardTypeToRender == CardTypeToRender.DATA && (
											<div className="flex flex-row w-full flex-wrap gap-2 self-stretch items-center justify-start pt-5">
												<>
													{activeCard.urls.map((urls) => (
														<button
															className="flex items-center gap-2 rounded-3xl border border-gray-200 px-2 py-1 bg-gray-50"
															onClick={() => handleOnClick(urls.url)}
														>
															<img
																className="w-4 h-4 flex-none rounded-full"
																src={`https://www.google.com/s2/favicons?domain=${urls.url}&sz=16`}
															/>

															<h3 className="inline-block text-xs font-medium text-gray-700 overflow-hidden overflow-ellipsis line-clamp-1">
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
