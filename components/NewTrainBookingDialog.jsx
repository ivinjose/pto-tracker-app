import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form(from composer)";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoute } from "@react-navigation/native";
import { differenceInCalendarDays, format, subDays } from "date-fns";
import { Plus } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import FormFieldInput from "@/components/ui/form-field-input";
import FormFieldTextarea from "@/components/ui/form-field-textarea";
import {
    TRAIN_BOOKING_BUFFER,
    TRAIN_NORMAL_BOOKING_OPENING_TIME,
    TRAIN_TATKAL_BOOKING_OPENING_TIME,
} from "@/constants/trainBooking";
import formSchema from "@/schemas/TrainBookingDay";
import useTrainBookingApiManager from "../api-managers/TrainBookingApiManager";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

const defaultFormValues = {
    name: "",
    travel_date: new Date(),
    train_booking_date: undefined,
    remarks: "",
};

export default function NewTrainBookingDialog({ children }) {
    const route = useRoute();
    const [showNewTrainBookingDialog, setShowNewTrainBookingDialog] = useState(
        route.params?.showNewTrainBookingDialog === "true"
    );
    const [isCalculated, setIsCalculated] = useState(false);
    const [isTatkalBooking, setIsTatkalBooking] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultFormValues,
    });

    const travelDate = form.watch("travel_date");

    useEffect(() => {
        setIsCalculated(false);
        setIsTatkalBooking(false);
    }, [travelDate]);

    const trainBookingApiManager = useTrainBookingApiManager();
    const queryClient = useQueryClient();

    const { mutateAsync: addTrainBooking } = useMutation({
        mutationFn: (data) => {
            const { name, travel_date, train_booking_date, remarks, is_tatkal } = data;
            const travel_dateStr = format(travel_date, "yyyy-MM-dd");
            const train_booking_dateStr = train_booking_date ? format(train_booking_date, "yyyy-MM-dd") : "";
            const time_slot = is_tatkal ? TRAIN_TATKAL_BOOKING_OPENING_TIME : TRAIN_NORMAL_BOOKING_OPENING_TIME;
            return trainBookingApiManager.createTrainBooking({
                name,
                travel_date: travel_dateStr,
                train_booking_date: train_booking_dateStr,
                remarks,
                is_tatkal,
                time_slot,
            });
        },
        onSuccess: async () => {
            form.reset({ ...defaultFormValues, travel_date: new Date() });
            setIsCalculated(false);
            setShowNewTrainBookingDialog(false);
            await queryClient.invalidateQueries(["trainBookings"]);
            toast({
                variant: "",
                description: "Your travel day was saved successfully!",
                className: "bg-green-600 text-white",
            });
        },
    });

    const onSubmit = async (data) => {
        if (!isCalculated) {
            const { travel_date } = data;
            const today = new Date();
            const daysUntilTravel = differenceInCalendarDays(travel_date, today);

            let trainBookingDate;
            let tatkal = false;

            if (daysUntilTravel < TRAIN_BOOKING_BUFFER) {
                trainBookingDate = subDays(travel_date, 1);
                tatkal = true;
            } else {
                trainBookingDate = subDays(travel_date, TRAIN_BOOKING_BUFFER);
            }

            form.setValue("train_booking_date", trainBookingDate, {
                shouldValidate: true,
                shouldDirty: true,
            });
            setIsTatkalBooking(tatkal);
            setIsCalculated(true);
            return;
        }
        await addTrainBooking({ ...data, is_tatkal: isTatkalBooking });
    };

    const onCancel = () => {
        form.reset({ ...defaultFormValues, travel_date: new Date() });
        setIsCalculated(false);
        setIsTatkalBooking(false);
    };

    const calculated = useMemo(() => {
        const td = form.getValues("travel_date");
        const bd = form.getValues("train_booking_date");
        return { travelDate: td, bookingDate: bd, isTatkal: isTatkalBooking };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCalculated, isTatkalBooking]);

    return (
        <Dialog open={showNewTrainBookingDialog} onOpenChange={setShowNewTrainBookingDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Train booking details</DialogTitle>
                </DialogHeader>

                <View className="mt-2.5">
                    <Form {...form}>
                        <View>
                            <FormLabel className="mb-2.5 block font-normal text-base text-[#4c4c4c]">
                                When do you wish to travel?
                            </FormLabel>
                            <View className="mb-5 flex gap-2.5">
                                <FormField
                                    control={form.control}
                                    name="travel_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-light",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "PPP") : <Text>Pick a date</Text>}
                                                            {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                                                            <FontAwesome name="calendar" size={24} color="black" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    {/* <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                            setIsCalendarOpen(false);
                                                        }}
                                                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                                        initialFocus
                                                    /> */}
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </View>

                            <View className="mb-5">
                                <FormFieldInput
                                    formControl={form.control}
                                    schemaProperty="name"
                                    placeholder="Christmas holiday to Hometown"
                                    labelText="Do you want to give it a name?"
                                    labelStyleClass="mb-2.5 block font-normal text-base text-[#4c4c4c]"
                                />
                            </View>

                            <View className="mb-5">
                                <FormFieldTextarea
                                    formControl={form.control}
                                    schemaProperty="remarks"
                                    placeholder="Type anything you want to remember"
                                    labelText="Remarks"
                                    labelStyleClass="mb-2.5 block font-normal text-base text-[#4c4c4c]"
                                    inputStyleClass="min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                            </View>

                            {isCalculated && (
                                <CalculatedBookingDate
                                    className="my-2.5 mb-5 rounded-[5px] border border-[#BEDBFF] bg-[#EEF6FF] px-3 py-4"
                                    travelDate={calculated.travelDate}
                                    trainBookingDate={calculated.bookingDate}
                                    isTatkalBooking={calculated.isTatkal}
                                />
                            )}

                            <View className="flex justify-end gap-2.5">
                                {isCalculated && (
                                    <Button type="button" variant="secondary" onPress={onCancel}>
                                        Cancel
                                    </Button>
                                )}
                                <Button onPress={form.handleSubmit(onSubmit)}>
                                    {isCalculated ? "Save date" : "Calculate train booking date"}
                                </Button>
                            </View>
                        </View>
                    </Form>
                </View>
            </DialogContent>

            {children || (
                <DialogTrigger asChild>
                    <Button type="button">
                        <Plus size={18} />
                        &nbsp;New train booking
                    </Button>
                </DialogTrigger>
            )}
        </Dialog>
    );
}

const CalculatedBookingDate = ({ className, travelDate, trainBookingDate, isTatkalBooking }) => {
    if (!travelDate || !trainBookingDate) return null;

    const openingTime = isTatkalBooking ? TRAIN_TATKAL_BOOKING_OPENING_TIME : TRAIN_NORMAL_BOOKING_OPENING_TIME;

    return (
        <View className={className}>
            {isTatkalBooking && (
                <Text className="mb-4 text-xs font-semibold text-[#b45309]">
                    This needs to be booked as a{" "}
                    <Text className="font-bold">tatkal</Text> ticket.
                </Text>
            )}
            <Text className="font-normal text-xs text-[#4b5269]">
                {isTatkalBooking ? "Tatkal ticket " : "Ticket"} booking opens on:
            </Text>
            <Text className="my-1.5 text-lg font-medium text-[#1C398E]">
                {format(trainBookingDate, "PPP")} at {openingTime} am
            </Text>
            <Text className="font-normal text-xs text-[#4b5269]">
                {isTatkalBooking
                    ? `1 day before your travel on ${format(travelDate, "PPP")}`
                    : `${TRAIN_BOOKING_BUFFER} days before your travel on ${format(travelDate, "PPP")}`}
            </Text>
        </View>
    );
};

