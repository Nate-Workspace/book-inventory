import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Edit, Loader2Icon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import useUpdateCategory from "../../hooks/category/useUpdateCategory";
import type Category from "../../models/Category";
import categorySchema, {
    type categoryFormData,
} from "../../models/CategorySchema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function CategoryUpdateDialog({
  cat,
  childButton,
}: {
  cat: Category;
  childButton?: ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending } = useUpdateCategory();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: cat.name,
      description: cat.description,
    },
  });

  const onSubmit = (data: categoryFormData) => {
    mutate(
      { id: cat.id, data: data },
      {
        onSuccess: () => {
          toast.success("Category Updated Successfully");
          reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {childButton ?? (
          <Button className="flex w-full cursor-pointer items-center justify-start rounded-md px-2 py-2 text-sm font-medium transition-colors">
            <Edit className="mr-3 h-4 w-4 flex-shrink-0" />
            Edit Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="font-[poppins]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Edit the category of your choosing
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5">
            <Label htmlFor="name">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="Theology"
              type="text"
              id="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="mt-5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="some description"
              id="description"
              {...register("description")}
            />
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {!isPending ? (
                <>
                  <Edit />
                  Edit
                </>
              ) : (
                <Loader2Icon className="animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
