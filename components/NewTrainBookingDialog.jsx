import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays, format, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "react-native-calendars";

import FormFieldInput from "@/components/ui/form-field-input";
import FormFieldTextarea from "@/components/ui/form-field-textarea";
import { Text } from "@/components/ui/text";
import {
    TRAIN_BOOKING_BUFFER,
    TRAIN_NORMAL_BOOKING_OPENING_TIME,
    TRAIN_TATKAL_BOOKING_OPENING_TIME,
} from "@/constants/trainBooking";
import formSchema from "@/schemas/TrainBookingDay";
import { Modal, Pressable, Button as RNButton, ScrollView, View } from "react-native";
import useTrainBookingApiManager from "../api-managers/TrainBookingApiManager";

const defaultFormValues = {
    name: "",
    travel_date: new Date(),
    train_booking_date: undefined,
    remarks: "",
};

export default function NewTrainBookingDialog({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCalculated, setIsCalculated] = useState(false);
    const [isTatkalBooking, setIsTatkalBooking] = useState(false);
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
            setIsOpen(false);
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

    }, [isCalculated, isTatkalBooking]);

    const formContent = (
        <View className="mt">
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
                                    <FormControl>
                                        <Accordion type='single' collapsible>
                                            <AccordionItem value='item-1'>
                                                <AccordionTrigger>
                                                    {/* <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            " pl-3 text-left font-light",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    > */}
                                                    {field.value ? <Text>{format(field.value, "PPP")}</Text> : <Text>Pick a date</Text>}
                                                    <FontAwesome name="calendar" size={24} color="black" />
                                                    {/* </Button> */}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <Calendar
                                                        initialDate={field.value ? format(field.value, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                                                        enableSwipeMonths={true}
                                                        minDate={format(new Date(), "yyyy-MM-dd")}
                                                        markedDates={
                                                            field.value
                                                                ? { [format(field.value, "yyyy-MM-dd")]: { selected: true } }
                                                                : {}
                                                        }
                                                        onDayPress={(day) => {
                                                            field.onChange(new Date(day.dateString));
                                                        }}
                                                    />
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </FormControl>
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
                        // inputStyleClass="min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                                <Text>Cancel</Text>
                            </Button>
                        )}
                        <Button onPress={form.handleSubmit(onSubmit)}>
                            <Text>{isCalculated ? "Save date" : "Calculate train booking date"}</Text>
                        </Button>
                    </View>
                </View>
            </Form>
        </View>
    );

    return (
        <>
            <Pressable onPress={() => setIsOpen(!isOpen)} className="mt-4 flex-row items-center justify-center gap-2 rounded-lg bg-[#212933] px-4 py-3 active:opacity-90">
                <Text className="text-lg text-[#ffffff]">
                    Add new booking
                </Text>
            </Pressable>
            <Modal
                visible={isOpen}
                onRequestClose={() => setIsOpen(false)}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View className="flex-1">
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 40, paddingBottom: 24 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {formContent}
                    </ScrollView>
                    <View className="px-10 pb-4">
                        <RNButton onPress={() => setIsOpen(false)} title="Close" />
                    </View>
                </View>
            </Modal>
        </>
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

