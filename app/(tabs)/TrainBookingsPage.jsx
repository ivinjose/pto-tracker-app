import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Pressable, ScrollView, Text, View } from "react-native";

import useTrainBookingApiManager from "@/api-managers/TrainBookingApiManager";
import CardView from "@/components/CardView";
import NewTrainBookingDialog from "@/components/NewTrainBookingDialog";
import TrainBookingCard from "@/components/TrainBookingCard";
import { useState } from "react";

export default function TrainBookingsPage() {
    const trainBookingApiManager = useTrainBookingApiManager();
    const [showNewTrainBookingDialog, setShowNewTrainBookingDialog] = useState(false);

    const { data: trainBookings = [], isLoading } = useQuery({
        queryKey: ["trainBookings"],
        queryFn: () => trainBookingApiManager.getTrainBookings({}),
    });

    const isEmpty = !isLoading && trainBookings.length === 0;

    const AddNewBooking = () => (
        <Pressable onPress={() => setShowNewTrainBookingDialog(true)} className="mt-4 flex-row items-center justify-center gap-2 rounded-lg bg-[#212933] px-4 py-3 active:opacity-90">
            <Text className="text-lg text-[#ffffff]">
                Add new booking
            </Text>
        </Pressable>
    )

    return (
        <View className="flex-1 bg-white">
            <View className="p-4 pb-0">
                {!isEmpty && !isLoading && (
                    <AddNewBooking />
                )}
            </View>

            <View className="flex-1">
                {isLoading ? (
                    <Loading />
                ) : isEmpty ? (
                    <View className="flex-1 flex-col items-center justify-center gap-4 px-4">
                        <Text className="text-sm text-[#6b7280] text-center">
                            Looks like you haven&apos;t added anything yet. Add something to get started
                        </Text>
                        <AddNewBooking />
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 16, paddingTop: 16 }}
                    >
                        <View className="gap-4">
                            {trainBookings?.map((booking) => (
                                <View
                                    key={booking._id ?? `${booking.travel_date}-${booking.name ?? ""}`}
                                >
                                    <TrainBookingCard {...booking} />
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>

            <Modal
                visible={showNewTrainBookingDialog}
                onRequestClose={() => setShowNewTrainBookingDialog(false)}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View className="flex-1 p-10">
                    <NewTrainBookingDialog />
                </View>
                <Button onPress={() => setShowNewTrainBookingDialog(false)} title="Close" />
            </Modal>
        </View>
    );
}

function Loading() {
    return (
        <View className="gap-4" style={{ padding: 16, paddingTop: 16 }}>
            <CardView actions={[]}>
                <View className="flex-row gap-4 p-4">
                    <View className="h-16 w-16 rounded-lg bg-[#f3f4f6]" />
                    <View className="flex-1 gap-2">
                        <View className="h-4 w-[190px] rounded bg-[#f3f4f6]" />
                        <View className="h-4 w-[160px] rounded bg-[#f3f4f6]" />
                        <View className="h-4 w-[220px] rounded bg-[#f3f4f6]" />
                        <View className="h-4 w-[120px] rounded bg-[#f3f4f6]" />
                    </View>
                </View>
            </CardView>
        </View>
    );
}
