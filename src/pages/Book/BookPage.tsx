import { ArrowLeft, Edit, Loader2Icon, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from "../../components/not-found";
import useBook from "../../hooks/book/useBook";
// import reactLogo from "../../assets/react.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { DialogFooter, DialogHeader } from "../../components/ui/dialog";
import useDeleteBook from "../../hooks/book/useDeleteBook";
import { useAuth } from "../../provider/AuthProvider";

const BookPage = () => {
  // get id from the parameters
  const { id } = useParams();

  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  // if there is no book
  if (!id) return <NotFound />;

  const { data: book, isLoading, error } = useBook(id);
  const { mutate: deleteBook, isPending } = useDeleteBook();
  const { user } = useAuth();

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  if (error || !book) return <NotFound />;

  return (
    <>
      <PageHeader title="" description="">
        <Button variant="outline" asChild>
          <Link to="/books">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </Button>
      </PageHeader>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 aspect-3/4 sm:w-1/2 xl:w-2/6 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
            <img
              src={book.book_img || "/placeholder.svg"}
              alt={book.title}
              className="object-cover"
              onError={(e) => e.currentTarget.src}
            />
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2">
              {book.title}
            </h1>
            <div className="dark:text-gray-200 text-gray-700">
              by <span className="font-semibold">{book.author}</span>
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Category: {book.category?.name || "-"}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Publisher: {book.publisher || "-"}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Published Year: {book.published_year || "-"}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Location: {book.location || "-"}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Pages: {book.pages}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Condition: {book.condition}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Available: {book.is_available ? "Yes" : "No"}
            </div>
            <div className="text-sm dark:text-gray-400 text-gray-500">
              Date Added:{" "}
              {book.created_at
                ? new Date(book.created_at).toLocaleString()
                : "-"}
            </div>
            {user?.role === "admin" && (
              <div className=" flex gap-5 mt-20 *:cursor-pointer">
                <Button
                  variant="secondary"
                  size="sm"
                  title="Edit book"
                  onClick={() => navigate(`/books/${book.id}/edit`)}
                >
                  <Edit className="h-3 w-3" /> Edit
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setOpen(true)}
                      size="sm"
                      title="Delete book"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="font-[poppins]">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your book data from our servers.
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
                          deleteBook({ id: book.id, path: book.book_path });
                          setOpen(false);
                          navigate("/books");
                        }}
                      >
                        {isPending ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          "Continue"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-500 whitespace-pre-line">
            {book.description || "No description provided."}
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Notes on the book</h2>
          <p className="text-gray-700 dark:text-gray-500 whitespace-pre-wrap">
            {book.notes || "No notes provided."}
          </p>
        </div>
      </div>
    </>
  );
};

export default BookPage;
