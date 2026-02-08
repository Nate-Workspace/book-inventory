import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2Icon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import BookSchema from "../../models/BookSchema";
import { toast } from "sonner";
import useAddBooks from "../../hooks/book/useAddBooks";
import useCategories from "../../hooks/category/useCategories";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { supabase } from "../../config/supabase";
import CategoryAddDialog from "../../components/category/category-add-dialog";

type FormData = z.infer<typeof BookSchema>;

export default function AddBookPage() {
  // form
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(BookSchema),
  });

  const condition = watch("condition");
  const category_id = watch("category_id");
  const [bookImg, setBookImg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [bookImgFile, setBookImgFile] = useState<File | null>(null);
  const { mutate, isPending: storeIsPending } = useAddBooks();
  const { data: categories, isLoading: catIsLoading } = useCategories();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookImgFile(file);
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBookImg(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setBookImg(null);
      }
    } else {
      setBookImgFile(null);
      setBookImg(null);
    }
  };
  const onSubmit = async (data: FormData) => {
    if (bookImgFile) {
      setIsPending(true);
      const filePath = `books/${Date.now()}_${bookImgFile.name}`;
      const { data: supabaseData, error } = await supabase.storage
        .from(import.meta.env.VITE_SUPABASE_BUCKET)
        .upload(filePath, bookImgFile);

      if (error) {
        toast.error("Failed to upload image.");
        setIsPending(false);
        return;
      }

      const { data: imgUrlData } = supabase.storage
        .from(import.meta.env.VITE_SUPABASE_BUCKET)
        .getPublicUrl(supabaseData.path);

      if (!imgUrlData) {
        toast.error("Failed to get image.");
        setIsPending(false);
        return;
      }

      data.book_img = imgUrlData?.publicUrl;
      data.book_path = supabaseData?.path;
      setIsPending(false);
    }

    mutate(data, {
      onSuccess: () => {
        reset();
        setBookImg(null);
        setBookImgFile(null);
        toast.success("Book added successfully!");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Book"
        description="Add a new book to your berea-cms collection"
      >
        <Button variant="outline" asChild>
          <Link to="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="book-img">Book Image</Label>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    name="book-img"
                    id="book-img"
                  />
                  {bookImg && (
                    <div className="mt-2">
                      <span className="text-gray-500">Image Preview:</span>
                      <img
                        src={bookImg}
                        alt="book-img Preview"
                        className="mt-2 max-h-40 rounded-md border"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter book title"
                      {...register("title")}
                    />
                    {errors.title && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.title.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="author">
                      Author <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="author"
                      placeholder="Enter author name"
                      {...register("author")}
                    />
                    {errors.author && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.author.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      placeholder="Publisher name"
                      {...register("publisher")}
                    />
                    {errors.publisher && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.publisher.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="publication-year">
                      Publication Year <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="publication-year"
                      placeholder="2025"
                      type="number"
                      {...register("published_year")}
                    />
                    {errors.published_year && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.published_year.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pages">
                      Pages <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="pages"
                      placeholder="Number of pages"
                      type="number"
                      {...register("pages")}
                    />
                    {errors.pages && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.pages.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location">
                      Shelf Location <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., A-12, B-05"
                      {...register("location")}
                    />
                    {errors.location && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.location.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="condition">
                      Condition <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={condition}
                      onValueChange={(value) =>
                        setValue(
                          "condition",
                          value as "excellent" | "good" | "bad",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="bad">Bad</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.condition && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.condition.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category">
                      Category <span className="text-red-400">*</span>
                    </Label>
                    {!catIsLoading ? (
                      categories?.length == 0 ? (
                        <CategoryAddDialog
                          childButton={
                            <Button
                              className="mt-3 cursor-pointer"
                              type="button"
                            >
                              <Plus />
                              Add Category
                            </Button>
                          }
                        />
                      ) : (
                        <Select
                          value={category_id?.toString()}
                          onValueChange={(value) =>
                            setValue("category_id", Number(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    ) : (
                      <Skeleton className="h-10 w-1/2 rounded-md" />
                    )}
                    {errors.category_id && (
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.category_id.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the book (optional)"
                    rows={3}
                    {...register("description")}
                  />
                  {errors.description && (
                    <div className="mt-2 text-xs text-red-400">
                      <p>{errors.description.message}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any internal notes about the book (optional)"
                    rows={2}
                    {...register("notes")}
                  />
                  {errors.notes && (
                    <div className="mt-2 text-xs text-red-400">
                      <p>{errors.notes.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0">
                  <Button variant="outline" asChild>
                    <Link to="/books">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending || storeIsPending ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Add Book"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
