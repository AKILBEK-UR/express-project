import {z} from "zod"

export const blogCreateDtoSchema = z.object({
    title: z
      .string()
      .min(1,"Title is required!"),
    content: z
      .string()
      .min(1,"Content is required!"),
    tags: z
      .string()
      .array()
      .optional()
})

export type BlogCreateDto = z.infer<typeof blogCreateDtoSchema>;