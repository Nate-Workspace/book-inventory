import z from "zod";

const categorySchema = z.object({
  name: z.string().min(1, { message: "Name is required for the category" }),
  description: z.string().optional(),
});

export type categoryFormData = z.infer<typeof categorySchema>;
export default categorySchema;