import OffDayCard from "@/components/OffDayCard";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import useOffDaysApiManager from "../../api-managers/OffDaysApiManager";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OffDay = Record<string, any>;

export default function HomePage() {
	const offDaysApiManager = useOffDaysApiManager();

	const { data: processedOffdays } = useQuery({
		queryKey: ["processedOffdays"],
		queryFn: () => offDaysApiManager.getProcessedOffDays({}),
	});

	return (
		<View className="flex-1 bg-white">
			<View className="p-4 pb-0">
				<Text className="text-2xl font-bold text-[#212933]">
					Manage Off Days
				</Text>
				<Pressable className="mt-4 flex-row items-center justify-center gap-2 rounded-lg bg-[#212933] px-4 py-3 active:opacity-90">
					<Plus size={18} color="white" />
					<Text className="text-base font-medium text-white">
						New off day
					</Text>
				</Pressable>
			</View>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 16, paddingTop: 16 }}
			>
				<View className="gap-4">
					{processedOffdays?.map((offDay: OffDay) => (
						// @ts-expect-error API returns untyped data
						<OffDayCard key={offDay._id} {...offDay} />
					))}
				</View>
			</ScrollView>
		</View>
	);
}
