import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../services/Apiclient";
import type { categoryFormData } from "../../models/CategorySchema";
import { queryClient } from "../../main";

const useAddCategory = () => {
  return useMutation<unknown, Error, categoryFormData>({
    mutationFn: async (data: categoryFormData) => {
      const response = await apiClient.post("/categories", data);
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

export default useAddCategory;
