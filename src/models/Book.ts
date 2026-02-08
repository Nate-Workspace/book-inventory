import type Category from "./Category";

export default interface Book {
  id: number;
  title: string;
  author: string;
  category: Category;
  is_available: boolean;
  location: string;
  created_at: string;
  description: string;
  pages: number;
  publisher: string;
  published_year: number;
  notes: string;
  condition: string;
  book_img: string;
  book_path: string;
}
