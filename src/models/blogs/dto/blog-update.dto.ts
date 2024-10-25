import z from "zod";
//id: string, updateData: { title: string; content: string }
export const blogUpdateDtoSchema = z.object({
    title: z
      .string()
      .min(1,"Title is required!"),
    content: z
      .string()
      .min(1,"Content is required!"),
})

export type BlogUpdateDto = z.infer<typeof blogUpdateDtoSchema>