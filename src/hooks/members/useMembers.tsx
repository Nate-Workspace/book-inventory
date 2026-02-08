import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import type Member from "../../models/Member";

interface GetMembersResponse {
  data: Member[];
}

const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () =>
      (await apiClient.get<GetMembersResponse>("/members")).data.data,
  });
};

export default useMembers;
