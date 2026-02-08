import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import type Category from "../../models/Category";

type mergedType = Category & { book_count: number };

interface fetchCategoriesResponse {
  status: boolean;
  message?: string;
  data?: mergedType[];
}

const useCategories = () => {
  return useQuery<unknown, Error, mergedType[]>({
    queryFn: async () => {
      const response = (
        await apiClient.get<fetchCategoriesResponse>("/categories")
      ).data;

      return response.data;
    },
    queryKey: ["categories"],
  });
};

export default useCategories;
