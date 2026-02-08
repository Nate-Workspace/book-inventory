export default interface Member {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: "admin" | "librarian" | "user";
  created_at: string;
  updated_at: string;
  checkouts: [];
}
