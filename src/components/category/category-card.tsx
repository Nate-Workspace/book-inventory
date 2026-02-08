import { DialogClose } from "@radix-ui/react-dialog";
import { Edit, Loader2Icon, Plus, Trash } from "lucide-react";
import { useState, type ReactNode } from "react";
import useDeleteCategory from "../../hooks/category/useDeleteCategory";
import type Category from "../../models/Category";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CategoryUpdateDialog from "./category-update-dialog";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ cat }: { cat: Category & { book_count: number } }) => {
  const { isPending: isPendingDelete } = useDeleteCategory();
  const navigate = useNavigate();

  return (
    <div className="hover:-translate-1 group flex cursor-pointer flex-col rounded-lg border p-4 shadow-sm duration-200 dark:bg-white/10">
      <div
        onClick={() => navigate(`/books?category_id=${cat.id}`)}
        className="mb-2 text-lg font-semibold group-hover:underline"
      >
        {cat.name[0].toUpperCase() + cat.name.slice(1)}
      </div>
      <div className="text-xs text-gray-500">
        {cat.description ?? "No description"}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        Books : {cat.book_count}
        <div>
          <CategoryUpdateDialog
            cat={cat}
            childButton={
              <Button
                variant={"ghost"}
                className="cursor-pointer"
                size={"icon"}
              >
                <Edit />
              </Button>
            }
          />
          <CategoryDeleteDialog
            cat={cat}
            childButton={
              <Button
                variant={"ghost"}
                className="cursor-pointer"
                disabled={isPendingDelete}
                size={"icon"}
              >
                {isPendingDelete ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <Trash />
                )}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

export function CategoryDeleteDialog({
  cat,
  childButton,
}: {
  cat: Category & { book_count: number };
  childButton?: ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {childButton ?? (
          <Button className="flex w-full cursor-pointer items-center justify-start rounded-md px-2 py-2 text-sm font-medium transition-colors">
            <Plus className="mr-3 h-4 w-4 flex-shrink-0" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="font-[poppins]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            categorized books data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose disabled={isPending} asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteCategory(
                { id: cat.id },
                {
                  onSettled: () => {
                    setOpen(false);
                  },
                },
              );
            }}
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
