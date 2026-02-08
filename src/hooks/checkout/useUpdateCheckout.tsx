import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { queryClient } from "../../main";

interface ResponseUpdateCheckout {
  status: boolean;
  message: string;
}

const useUpdateCheckout = () => {
  const updateCheckout = async (id: number) => {
    const response = await apiClient.patch(`/checkouts/${id}`);

    return response.data;
  };

  return useMutation<ResponseUpdateCheckout, AxiosError, { id: number }>({
    mutationFn: ({ id }) => updateCheckout(id),
    onError: (error: any) => {
      if (error.response.data.message) toast.error(error.response.data.message);
      else if (error.response.data.errors) {
        for (const key in error.response.data.errors) {
          toast.error(error.response.data.errors[key][0]);
        }
      } else toast.error("Error Occurred Try again");
    },
    onSuccess: () => {
      toast.success("Checkout Renewed successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export default useUpdateCheckout;
