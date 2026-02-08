import { BookAIcon, Loader2Icon, Plus } from "lucide-react";
import CategoryAddDialog from "../../components/category/category-add-dialog";
import CategoryCard from "../../components/category/category-card";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import useCategories from "../../hooks/category/useCategories";

const CategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      <PageHeader
        title="Book Categories"
        description="Organize your books with categories"
      >
        <div className="flex items-center space-x-2">
          <CategoryAddDialog />
        </div>
      </PageHeader>

      {isLoading && (
        <div className="flex h-[75vh] w-full items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && categories?.length === 0 && (
        <div className="flex h-[75vh] flex-col items-center justify-center py-12 text-center">
          <BookAIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No category found
          </h3>
          <p className="mb-4 text-gray-500">No categories so far</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="text-accent-foreground/60 mb-5 text-2xl font-bold">
            Categories
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, index) => (
              <CategoryCard cat={cat} key={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
