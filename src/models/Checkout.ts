import type Book from "./Book";
import type Member from "./Member";

export default interface Checkout {
  id: number;
  user: Member;
  book_id: number;
  book: Book;
  created_at: string;
  renewal_number: number;
  return_date: string;
}
