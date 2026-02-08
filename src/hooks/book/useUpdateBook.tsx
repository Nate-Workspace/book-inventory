import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../services/Apiclient";
import type { z } from "zod";
import type BookSchema from "../../models/BookSchema";

type FormData = z.infer<typeof BookSchema>;

const useUpdateBook = () => {
  return useMutation<unknown, Error, { id: string; data: FormData }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/books/${id}`, data);
      return response.data;
    },
    onError: (error: Error) => {
      let message = "An error occurred";
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as any).isAxiosError &&
        (error as any).response?.data &&
        typeof (error as any).response.data === "object" &&
        "errors" in (error as any).response.data
      ) {
        const axiosError = error as any;
        for (const key in axiosError.response.data.errors) {
          toast.error(
            axiosError.response.data.errors[key][0] ??
              "An unknown error occurred"
          );
        }
      } else if (error.message) {
        message = error.message;
      } else {
        toast.error(message);
      }
    },
  });
};

export default useUpdateBook;
