import { z } from 'zod';

export const userSignUpDtoSchema = z.object({
//   id: z.string().uuid({ message: "Invalid ID format" }),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(70, { message: "Max length is 70" }),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(100, { message: "Max length is 100" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Max length is 100" }),
});

export type UserSignUpDto = z.infer<
    typeof userSignUpDtoSchema
>;