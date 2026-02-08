import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/Apiclient";
import type Book from "../models/Book";
import type User from "../models/User";

interface Analytics {
  total_books: number;
  total_members: number;
  total_checkouts: number;
  overdue_books: number;
  popular_books: {
    book_id: number;
    borrow_count: number;
    book: Book;
  }[];
  recent_activities: {
    id: number;
    book_id: number;
    user_id: number;
    created_at: string;
    type: "return" | "checkout";
    book: Book;
    user: User;
  }[];
}

const useAnalytics = () => {
  const fetchAnalytics = async () => {
    const response = await apiClient.get<Analytics>("/analytics");

    return response.data;
  };

  return useQuery({ queryFn: fetchAnalytics, queryKey: ["analytics"] });
};

export default useAnalytics;
