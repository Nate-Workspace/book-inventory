import z from "zod";

const BookSchema = z.object({
  book_img: z.string().optional(),
  book_path: z.string().optional(),
  title: z
    .string({ message: "Title is required" })
    .min(3, { message: "Title must be between 3 and 100 characters" })
    .max(100),
  author: z
    .string({ message: "Author is required" })
    .min(3, { message: "Author must be between 3 and 100 characters" })
    .max(100),
  category_id: z
    .number({ message: "Category is required" })
    .positive({ message: "Category must be a valid ID" }),
  publisher: z.string().optional(),
  published_year: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, {
      message: "Published Year must be a positive number",
    })
    .transform((val) => Number(val)),
  pages: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, {
      message: "Pages must be a positive number",
    })
    .transform((val) => Number(val)),
  location: z
    .string({ message: "Location is required" })
    .min(1, { message: "Location must be at least 1 character" })
    .max(10, { message: "Location must be at most 10 characters" }),
  condition: z.enum(["excellent", "good", "bad"], {
    message: "Condition is required",
  }),
  description: z
    .string({ message: "Description is required" })
    .min(3, { message: "Description must be between 3 and 400 characters" })
    .max(400),
  notes: z.string().optional(),
});

export default BookSchema;