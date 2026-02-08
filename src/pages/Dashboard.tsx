import {
  AlertCircle,
  BookOpen,
  Calendar,
  Loader2Icon,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/page-header";
import { CheckoutBookDialog } from "../components/sidebar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import useAnalytics from "../hooks/useAnalytics";
// import useCategories from "../hooks/useCategories";

export default function Dashboard() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  function formatTimeAgo(created_at: string): import("react").ReactNode {
    const date = new Date(created_at);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your church library system"
      />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_books}</div>
              <p className="text-xs text-muted-foreground">total books</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.total_members}
              </div>
              <p className="text-xs text-muted-foreground">total members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Books Checked Out
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.total_checkouts}
              </div>
              <p className="text-xs text-muted-foreground">total checkouts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Books
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {analytics?.overdue_books}
              </div>
              <p className="text-xs text-muted-foreground">needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest book check-outs and returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recent_activities && analytics.recent_activities.length > 0 ? (
                    analytics.recent_activities.map((act, index) => (
                      <div className="flex items-center" key={index}>
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${
                            act.type === "checkout" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            "{act.book.title}" {act.type === "checkout" ? "checked out" : "returned"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {act.user.name} &middot; {formatTimeAgo(act.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                      <Calendar className="h-8 w-8 mb-2 opacity-40" />
                      <p className="text-sm font-semibold">No recent activity</p>
                      <p className="text-xs">Check out or return a book to see activity here.</p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link to="/checkouts">View All Activity</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Popular Books */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
                <CardDescription>Most borrowed this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.popular_books.map(
                    ({ book, borrow_count }, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {book.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {book.author}
                          </p>
                        </div>
                        <Badge variant="secondary">{borrow_count}</Badge>
                      </div>
                    )
                  )}
                    {(!analytics?.popular_books || analytics.popular_books.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                      <BookOpen className="h-8 w-8 mb-2 opacity-40" />
                      <p className="text-sm font-semibold">No popular books yet</p>
                      <p className="text-xs">Add books and check them out to see stats here.</p>
                    </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Alert */}
            <Card className="border-destructive/50 dark:border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Overdue Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium">
                      {analytics?.overdue_books ?? 0}{" "}
                      {(analytics?.overdue_books ?? 0) > 1 ? "books" : "book"}{" "}
                      overdue
                    </p>
                    <p className="text-muted-foreground">
                      members need to be contacted
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link to="/checkouts?filter=overdue">
                      View Overdue Books
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Button asChild className="h-20 flex-col">
                  <Link to="/books/add">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Add Book
                  </Link>
                </Button>
                <CheckoutBookDialog
                  childButton={
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-transparent"
                    >
                      <Calendar className="h-6 w-6 mb-2" />
                      Check Out
                    </Button>
                  }
                />
                <Button
                  asChild
                  variant="outline"
                  className="h-20 flex-col bg-transparent"
                >
                  <Link to="/members/add">
                    <Users className="h-6 w-6 mb-2" />
                    Add Member
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
