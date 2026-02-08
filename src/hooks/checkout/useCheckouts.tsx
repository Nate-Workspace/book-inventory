import { useQuery } from "@tanstack/react-query";
import type Checkout from "../../models/Checkout";
import apiClient from "../../services/Apiclient";

interface fetchCheckoutsResponse {
  current_page: number;
  data: Checkout[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const useCheckouts = () => {
  const fetchCheckouts = async () => {
    const response = (await apiClient.get<fetchCheckoutsResponse>("/checkouts"))
      .data;
    return response.data;
  };

  return useQuery({
    queryFn: fetchCheckouts,
    queryKey: ["checkouts"],
  });
};

export default useCheckouts;
