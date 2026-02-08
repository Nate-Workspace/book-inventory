import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../main";
import apiClient from "../../services/Apiclient";

const useDeleteCategory = () => {
  return useMutation<unknown, Error, { id: number }>({
    mutationFn: async ({ id }) => {
      const response = await apiClient.delete(`/categories/${id}`);

      toast.success(response.data.message)
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

export default useDeleteCategory;
