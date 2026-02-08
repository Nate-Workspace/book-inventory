import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../services/Apiclient";
import type { z } from "zod";
import type BookSchema from "../../models/BookSchema";

type FormData = z.infer<typeof BookSchema>;

const useAddBooks = () => {
  return useMutation<unknown, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const response = await apiClient.post("/books", data);
      return response.data;
    },
    onError: (error: any) => {
      if (error.response.data.message) toast.error(error.response.data.message);
      else if (error.response.data.errors) {
        for (const key in error.response.data.errors) {
          toast.error(error.response.data.errors[key][0]);
        }
      } else toast.error("Error Occurred Try again");
    },
  });
};

export default useAddBooks;
