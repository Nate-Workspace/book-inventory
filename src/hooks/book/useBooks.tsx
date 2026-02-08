import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import type Book from "../../models/Book";

export interface FetchBooksResponse {
  current_page: number;
  data: Book[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const useBooks = ({
  page,
  title,
  category,
  status,
}: {
  page: number;
  title?: string;
  category?: string;
  status?: string;
}) => {
  const fetchBooks = () =>
    apiClient
      .get<FetchBooksResponse>(
        (() => {
          const params = [
            `per_page=12`,
            `page=${page}`,
            `title=${title ?? ""}`,
          ];
          if (category && category !== "all") {
            params.push(`category=${category}`);
          }
          if (status && status !== "all") {
            params.push(`status=${status}`);
          }
          return `/books?${params.join("&")}`;
        })()
      )
      .then((res) => {  
        return res.data;
      });

  return useQuery<FetchBooksResponse | undefined, Error>({
    queryKey: ["books", page, title, category, status],
    queryFn: fetchBooks,
  });
};

export default useBooks;
