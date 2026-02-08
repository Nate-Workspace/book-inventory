import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import { toast } from "sonner";
import type { UserProfileFormData } from "../../models/UserSchema";

const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: UserProfileFormData) => {
      const res = await apiClient.post("/user/profile", data);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update profile");
      return res.data;
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
      );
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
  });
};

export default useUpdateProfile;
