import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// import { Calendar } from "@/components/ui/calendar";

import { CalendarPlus } from "lucide-react-native";

import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";

import CardView from "@/components/CardView";
import useOffDaysApiManager from "../api-managers/OffDaysApiManager";

const OffDayCard = ({
    _id,
    offday_name,
    offday_owner,
    start_date,
    end_date,
    remarks,
    isReadOnly,
    datesToWeekend = [],
    weekendProximity = {},
    lastOffDay = {},
    nextOffDay = {},
}) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const { toast } = useToast();
    const offDaysApiManager = useOffDaysApiManager();
    const queryClient = useQueryClient();

    const { mutateAsync: removeOffDay } = useMutation({
        mutationFn: (data) => offDaysApiManager.deleteOffDay(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries(["processedOffdays"]);

            toast({
                description: "Your off day was deleted successfully!",
            });
        },
    });

    const onDelete = useCallback(() => {
        removeOffDay(_id);
    }, [_id, removeOffDay]);

    const actions = useMemo(() => {
        if (isReadOnly) return [];

        return [
            {
                label: "Delete",
                action: () => setShowConfirm(true),
            },
        ];
    }, [isReadOnly]);

    return (
        <>
            <CardView actions={actions}>
                <Dialog>
                    <View className="flex-row items-center p-4">
                        <DialogTrigger asChild>
                            <Pressable className="active:opacity-80 mr-4">
                                <CalendarPlus size={48} color="#212933" />
                            </Pressable>
                        </DialogTrigger>

                        <View className="flex-1 min-w-0">
                            <Text className="text-base font-semibold text-[#212933]">
                                {offday_name}
                            </Text>
                            <Text className="mt-1 text-sm font-normal text-[#444]">
                                {offday_owner}
                            </Text>
                            <OffDays start_date={start_date} end_date={end_date} />
                            {remarks ? (
                                <Text className="mt-1 text-sm text-[#555]">{remarks}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View className="px-4 pb-2">
                        <WeekendProximityAlert
                            weekendProximity={weekendProximity}
                            start_date={start_date}
                            end_date={end_date}
                        />
                        <PTORecommendationForWeekend datesToWeekend={datesToWeekend} />
                        <OffDayRecommendation recommendation={lastOffDay} />
                        <OffDayRecommendation recommendation={nextOffDay} />
                    </View>

                    <DialogTrigger asChild>
                        <Pressable className="mx-4 mb-4 rounded-lg bg-[#212933] py-3 active:opacity-90">
                            <Text className="text-center text-base font-medium text-white">
                                View details
                            </Text>
                        </Pressable>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>
                            <Text className="text-base font-medium pt-2 pl-2">
                                {offday_name}
                            </Text>
                        </DialogTitle>
                    </DialogContent>
                </Dialog>
            </CardView>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this off day.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel onPress={() => setShowConfirm(false)}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction onPress={onDelete}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

const OffDays = ({ start_date, end_date }) => {
    const rowClass = "text-sm font-normal text-[#444]";
    if (isSameDay(start_date, end_date)) {
        return <Text className={`${rowClass} mt-0.5`}>{format(start_date, 'PPPP')}</Text>;
    }
    return (
        <View className="mt-0.5 gap-0.5">
            <Text className={rowClass}>From: {format(start_date, 'PPPP')}</Text>
            <Text className={rowClass}>To: {format(end_date, 'PPPP')}</Text>
        </View>
    )
}

const WeekendProximityAlert = ({ weekendProximity, start_date, end_date }) => {
    const rowClass = "text-sm font-normal text-[#444] mb-1.5 last:mb-0";
    const sectionClass = "p-3 rounded mt-2.5 border border-[#c9f2d5] bg-[#edfbf1]";
    if (weekendProximity.startDate > 1 && weekendProximity.endDate > 1) {
        return null;
    }
    if (start_date === end_date) {
        return (
            <View className={sectionClass}>
                <Text className={rowClass}>Your date is next to a weekend</Text>
            </View>
        );
    } else {
        return (
            <View className={sectionClass}>
                {weekendProximity.startDate === 1 && (
                    <Text className={rowClass}>Your start date is next to a weekend</Text>
                )}
                {weekendProximity.endDate === 1 && (
                    <Text className={rowClass}>Your end date is next to a weekend</Text>
                )}
            </View>
        );
    }
}

const PTORecommendationForWeekend = ({ datesToWeekend }) => {
    const rowClass = "text-sm font-normal text-[#444] mb-1.5 last:mb-0";
    const sectionClass = "p-3 rounded mt-2.5 border border-[#e1e4e8] bg-[#f0f4f8]";
    if (datesToWeekend.length === 0) {
        return null;
    }
    return (
        <View className={sectionClass}>
            <Text className={rowClass}>You can combine this with weekend by taking off on these days:</Text>
            {datesToWeekend.map((suggestedDate, index) => (
                <Text key={index} className={rowClass}>{format(suggestedDate, 'PPPP')}</Text>
            ))}
        </View>
    )
}

const OffDayRecommendation = ({ recommendation }) => {
    const rowClass = "text-sm font-normal text-[#444] mb-1.5 last:mb-0";
    const sectionClass = "p-3 rounded mt-2.5 border border-[#e1e4e8] bg-[#f0f4f8]";
    if (!recommendation || !recommendation.dates || recommendation.dates.length === 0) {
        return null;
    }

    /* no point in showing recommendations that are more than 2 days */
    if (recommendation.dates.length > 2) {
        return null;
    }

    return (
        <View className={sectionClass}>
            <Text className={rowClass}>You can combine this with {recommendation.day.offday_name} by taking off on these days:</Text>
            {recommendation.dates.map((suggestedDate, index) => (
                <Text key={index} className={rowClass}>{format(suggestedDate, 'PPPP')}</Text>
            ))}
        </View>
    )
}

export default OffDayCard;