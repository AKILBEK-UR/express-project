import { z } from 'zod';

export const userLoginDtoSchema = z.object({
//   id: z.string().uuid({ message: "Invalid ID format" }),
  email: z
    .string()
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
});

export type UserLoginDto = z.infer<typeof userLoginDtoSchema>;