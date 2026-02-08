import { useQuery } from "@tanstack/react-query";
import { getBook } from "../../services/BookServices";

const useBook = (id: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const book = (await getBook(id)).data;
      return book;
    },
  });
};

export default useBook;
