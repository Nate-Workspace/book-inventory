import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { z } from "zod";
import type { CheckoutSchema } from "../../models/CheckoutSchema";
import apiClient from "../../services/Apiclient";
import type Checkout from "../../models/Checkout";
import { queryClient } from "../../main";
import { toast } from "sonner";

interface AddCheckoutResponse {
  status: boolean;
  message: string;
  data: Checkout;
  errors?: any;
}

const useAddCheckout = () => {
  return useMutation<
    AddCheckoutResponse,
    AxiosError,
    { data: z.infer<typeof CheckoutSchema> }
  >({
    mutationFn: async ({ data }) => {
      const response = await apiClient.post<AddCheckoutResponse>(
        "/checkouts",
        data
      );

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
      toast.success("Checkout Added successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export default useAddCheckout;
