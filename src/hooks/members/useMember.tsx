import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import type Member from "../../models/Member";

const useMember = (id: string | number | undefined) => {
  return useQuery<Member, Error, any>({
    queryKey: ["member", id],
    queryFn: async () => {
      if (!id) throw new Error("No member id provided");
      const res = await apiClient.get(`/members/${id}`);
      if (!res.data.status)
        throw new Error(res.data.message || "Member not found");
      return res.data.data;
    },
    enabled: !!id,
  });
};

export default useMember;
