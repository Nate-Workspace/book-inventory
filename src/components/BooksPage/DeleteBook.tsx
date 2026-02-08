import { Trash2, Loader2Icon } from "lucide-react";
import { useState } from "react";
import useDeleteBook from "../../hooks/book/useDeleteBook";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import type Book from "../../models/Book";

const DeleteBook = ({ book, isOnMenu }: { isOnMenu?: boolean; book: Book }) => {
  const { mutate: deleteBook, isPending } = useDeleteBook();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          size="sm"
          title="Delete book"
          className={`${isOnMenu ? "w-full flex items-center justify-start -pl-2" : ""}`}
        >
          <Trash2 className={`${isOnMenu ? "h-4 w-4 dark:text-white/70 text-black/40" : "h-4 w-4"}`} />
          {isOnMenu && "delete"}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-[poppins]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your book
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            onClick={() => {
              setOpen(false);
            }}
            asChild
          >
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteBook(
                { id: book.id, path: book.book_path },
                {
                  onSettled: () => {
                    setOpen(false);
                  },
                }
              );
            }}
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBook;
