import { z } from "zod";

const formSchema = z.object({
    offday_name: z.string(),
    offday_owner: z.string({
        required_error: "User is required.",
    }),
    start_date: z.date({
        required_error: "Date is required.",
    }),
    end_date: z.date({
        required_error: "Date is required.",
    }),
    remarks: z.string().optional(),
});

export default formSchema;