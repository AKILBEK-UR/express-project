import {z} from "zod"


export const createCommentDtoSchema = z.object({
    content: z
        .string()
        .min(1, "Comments is required!")
})

export type CommentCreateDto = z.infer<typeof createCommentDtoSchema>