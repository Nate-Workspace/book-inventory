import z from "zod";

export const CheckoutSchema = z.object({
  user_id: z.number({ required_error: "Please select a user." }),
  book_id: z.number({ required_error: "Please select a book." }),
  return_date: z.string({ required_error: "Please select a return date." }),
});