import { Calendar, Grid, List, Loader2Icon, Plus, Search } from "lucide-react";
import { useState } from "react";
import CheckoutCard from "../../components/BooksPage/CheckoutCard";
import CheckoutRow from "../../components/checkout/CheckoutRow";
import { PageHeader } from "../../components/page-header";
import { CheckoutBookDialog } from "../../components/sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import useCheckouts from "../../hooks/checkout/useCheckouts";
import type Checkout from "../../models/Checkout";

type ViewMode = "table" | "cards";

export default function CheckoutsPage() {
  const { data: checkouts, isLoading } = useCheckouts();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");

  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");

  const [statusFilter, setStatusFilter] = useState(
    filter === "overdue" ? "false" : "all",
  );

  const getDaysRemaining = (checkout: Checkout) => {
    const now = new Date();
    const returnDate = checkout.return_date
      ? new Date(checkout.return_date)
      : null;
    const daysRemaining = returnDate
      ? Math.ceil(
          (returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

    return daysRemaining;
  };

  const filteredCheckouts = checkouts?.filter((checkout) => {
    const daysRemaining = getDaysRemaining(checkout);

    const matchesSearch =
      checkout.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      daysRemaining <= 0 === (statusFilter === "false");

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Check-outs"
        description="Manage book loans and returns"
      >
        <div className="flex items-center space-x-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
          >
            <ToggleGroupItem value="table" aria-label="Table view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="cards" aria-label="Card view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <CheckoutBookDialog
            childButton={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Check-out
              </Button>
            }
          />
        </div>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="relative flex-1">
                <Search className="top-3/5 absolute left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search by member name, book title, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredCheckouts?.length} of {checkouts?.length}{" "}
                check-outs
              </p>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Checkout Date
                      </TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Renewals
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCheckouts?.map((checkout) => {
                      const daysRemaining = getDaysRemaining(checkout);

                      return (
                        <CheckoutRow
                          checkout={checkout}
                          daysRemaining={daysRemaining}
                          key={checkout.id}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCheckouts?.map((checkout) => (
                  <CheckoutCard key={checkout.id} checkout={checkout} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredCheckouts?.length === 0 && (
              <div className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No check-outs found
                </h3>
                <p className="mb-4 text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No books are currently checked out"}
                </p>
                <CheckoutBookDialog
                  childButton={
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Check-out
                    </Button>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
