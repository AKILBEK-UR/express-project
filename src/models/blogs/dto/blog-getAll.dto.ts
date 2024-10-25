import { z } from 'zod';

export const blogGetAllDtoSchema = z.object({
  page: z
    .number()
    .int({ message: "Page must be an integer!" })
    .min(1, { message: "Page must be at least 1!" }),

  limit: z
    .number()
    .int({ message: "Limit must be an integer!" })
    .min(1, { message: "Limit must be at least 1!" })
    .max(10, { message: "Limit can't be greater than 10" })
});

export type BlogGetAllDto = z.infer<typeof blogGetAllDtoSchema>;
