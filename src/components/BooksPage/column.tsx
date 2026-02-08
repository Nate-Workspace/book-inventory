import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import type Book from "../../models/Book";
import DeleteBook from "./DeleteBook";
import { CheckoutBookDialog } from "./BookCard";

export const columns: ColumnDef<Book>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
      const navigate = useNavigate();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              className="h-8 cursor-pointer w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-[poppins]" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/books/${book.id}`)}
              title="View details"
            >
              <Eye className="h-4 w-4" /> view
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/books/${book.id}/edit`)}
            >
              <Edit className="h-4 w-4" /> edit
            </DropdownMenuItem>
            <DeleteBook book={book} isOnMenu />
            <CheckoutBookDialog book={book} isOnMenu />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "",
  },
  {
    accessorKey: "is_available",
    header: "Available",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "created_at",
    header: "Date Added",
    cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
  },
  {
    accessorKey: "pages",
    header: "Pages",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
];
