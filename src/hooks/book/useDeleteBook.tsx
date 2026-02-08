import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../main";
import apiClient from "../../services/Apiclient";
import { supabase } from "../../config/supabase";
import type Book from "../../models/Book";

interface DeleteResponse {
  status: boolean;
  message: string;
}

const useDeleteBook = () => {
  return useMutation<DeleteResponse, Error, { id: number; path: string }>({
    mutationFn: async ({ id, path }) => {
      if (path)
        await supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET)
          .remove([path]);

      const response = await apiClient.delete<DeleteResponse>(`/books/${id}`);
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["books"] });

      const previousBooks = queryClient.getQueryData<{ data: Book[] }>([
        "books",
      ]);

      if (previousBooks && previousBooks.data) {
        queryClient.setQueryData(
          ["books"],
          (old: { data: Book[] } | undefined) => {
            return {
              ...old,
              data: old?.data.filter((book: Book) => book.id !== id),
            };
          }
        );
      }

      return { previousBooks };
    },
    onError: (error: any, _variables, context) => {
      console.error(error);

      if (error.response.data.message) toast.error(error.response.data.message);
      else if (error.response.data.errors) {
        for (const key in error.response.data.errors) {
          toast.error(error.response.data.errors[key][0]);
        }
      } else toast.error("Error Occurred Try again");
      if (
        context &&
        (context as { previousBooks: { data: any[] } }).previousBooks
      ) {
        queryClient.setQueryData(
          ["books"],
          (context as { previousBooks: { data: any[] } }).previousBooks
        );
      }
    },
    onSuccess: () => {
      toast.success("Book deleted successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export default useDeleteBook;
