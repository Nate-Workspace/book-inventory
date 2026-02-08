import z from "zod";

export const UserProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const UserPasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, { message: "Current password is required" }),
    new_password: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
  });

export type UserProfileFormData = z.infer<typeof UserProfileSchema>;
export type UserPasswordFormData = z.infer<typeof UserPasswordSchema>;
