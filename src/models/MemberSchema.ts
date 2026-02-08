import z from "zod";

const MemberSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must contain at least 3 character(s)" }),
  phone: z.string({ message: "Phone is required" }).min(10,{ message: "Phone must contain at least 10 character(s)" }),
  email: z.string({ message: "Email is required" }).email(),
  role: z.enum(["admin", "librarian", "user"]).optional(),
});

export type MemberFormData = z.infer<typeof MemberSchema>;

export default MemberSchema;
