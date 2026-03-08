import { z } from "zod";

const formSchema = z.object({
    name: z.string(),
    age: z.string(),
    gender: z.string(),
});

export default formSchema;