import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import useOffDaysApiManager from "../../api-managers/OffDaysApiManager";
// import NewOffDayDialog from "../../components/NewOffDayDialog";
// import OffDayCalendar from "../../components/OffDayCalendar";
// import OffDayCard from "../../components/OffDayCard";

/**
 * Expo/React Native version of HomePage for mobile devices.
 * Uses NativeWind for styling (Tailwind-like classes).
 *
 * Note: Child components (PageHeader, OffDayCalendar, NewOffDayDialog, OffDayCard)
 * must have React Native–compatible implementations when used in an Expo project.
 */

// useEffect(() => {
// 	axios.get('/api/login').then((response) => {
// 		console.log(response.data);
// 	});
// }, []);

export default function HomePage() {
	const offDaysApiManager = useOffDaysApiManager();

	const { data: processedOffdays, isProcessedOffDaysLoading } = useQuery({
		queryKey: ["processedOffdays"],
		queryFn: () => offDaysApiManager.getProcessedOffDays({}),
	});

	const { data: calendarDays, isCalendarLoading } = useQuery({
		queryKey: ["calendarDays"],
		queryFn: () => offDaysApiManager.getRawOffDays({}),
	});

	const handleCalendarSelect = (dates) => {
		console.log(dates);
		console.log(processedOffdays);
	};

	return (
		<View className="text-sm flex-1  bg-white">
			<View className="flex flex-col">
				<View className="flex flex-col">
					<Text>Off Day Calendar</Text>
					{/* <OffDayCalendar
						processedOffdays={processedOffdays}
						onSelect={handleCalendarSelect}
					/> */}
					<View className="flex justify-center mt-5 mb-5">
						{/* <NewOffDayDialog /> */}
						<Text>New Off Day Dialog</Text>
					</View>
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
					>
						<View className="gap-5 mt-5">
							{processedOffdays?.map((offDay) => (
								<View key={offDay._id}>
									<Text>Off Day Card</Text>
									{/* <OffDayCard {...offDay} /> */}
								</View>
							))}
						</View>
					</ScrollView>
				</View>
			</View>
		</View>
	);
}
