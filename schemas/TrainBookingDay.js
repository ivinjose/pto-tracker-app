import { z } from "zod";

const formSchema = z.object({
    name: z.string(),
    travel_date: z.date({
        required_error: "Date is required.",
    }),
    train_booking_date: z.date().optional(),
    remarks: z.string().optional(),
});

export default formSchema;