import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../main";
import apiClient from "../../services/Apiclient";

interface DeleteResponse {
  status: boolean;
  message: string;
}

const useDeleteMember = () => {
  return useMutation<DeleteResponse, Error, { id: number }>({
    mutationFn: async ({id}) => {
      const response = await apiClient.delete<DeleteResponse>(`/members/${id}`);
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["members"] });

      const previousMembers = queryClient.getQueryData<{ data: any[] }>([
        "members",
      ]);

      if (previousMembers && previousMembers.data) {
        queryClient.setQueryData(
          ["members"],
          (old: { data: any[] } | undefined) => {
            return {
              ...old,
              data: old?.data.filter((book: any) => book.id !== id),
            };
          }
        );
      }

      return { previousMembers };
    },
    onError: (_error, _variables, context) => {
      console.error(_error);

      toast.error(
        "Failed to delete the member. Please try again." + _error.name
      );
      if (
        context &&
        (context as { previousMembers: { data: any[] } }).previousMembers
      ) {
        queryClient.setQueryData(
          ["members"],
          (context as { previousMembers: { data: any[] } }).previousMembers
        );
      }
    },
    onSuccess: () => {
      toast.success("Member deleted successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export default useDeleteMember;
