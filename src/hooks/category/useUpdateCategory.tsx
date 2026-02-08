import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../services/Apiclient";
import type { categoryFormData } from "../../models/CategorySchema";
import { queryClient } from "../../main";

const useUpdateCategory = () => {
  return useMutation<unknown, Error, { id: number; data: categoryFormData }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(`/categories/${id}`, data);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export default useUpdateCategory;
