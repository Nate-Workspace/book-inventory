import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import { toast } from "sonner";
import type { UserPasswordFormData } from "../../models/UserSchema";

const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: UserPasswordFormData) => {
      const res = await apiClient.post("/user/password", data);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update password");
      return res.data;
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update password",
      );
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
  });
};

export default useUpdatePassword;
