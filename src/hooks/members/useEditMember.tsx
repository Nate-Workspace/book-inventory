import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../services/Apiclient";
import type { MemberFormData } from "../../models/MemberSchema";

interface EditMemberInput extends MemberFormData {
  id: number | string;
}

const useEditMember = () => {
  return useMutation<unknown, Error, EditMemberInput>({
    mutationFn: async ({ id, ...data }: EditMemberInput) => {
      
      
      const response = await apiClient.patch(`/members/${id}`, data);
      return response.data;
    },
    onError: (error: any) => {
      if (error.response?.data?.message)
        toast.error(error.response.data.message);
      else if (error.response?.data?.errors) {
        for (const key in error.response.data.errors) {
          toast.error(error.response.data.errors[key][0]);
        }
      } else toast.error("Error Occurred Try again");
    },
  });
};

export default useEditMember;
