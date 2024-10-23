import {z} from "zod"


export const commentGetAllDtoSchema = z.object({
    limit: z
    .number()
    .int({ message: "Limit must be an integer!" })
    .min(1, { message: "Limit must be at least 1!" })
    .max(10, { message: "Limit can't be greater than 10" })
})

export type CommentGetAllDto = z.infer<typeof commentGetAllDtoSchema>