import {z} from "zod"


export const commentUpdateDtoSchema = z.object({
    content: z
        .string()
        .min(1, "Comments is required!")
})

export type CommentUpdateDto = z.infer< typeof commentUpdateDtoSchema>