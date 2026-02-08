"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  BookOpen,
  AlertCircle,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { PageHeader } from "../components/page-header";

// Fake data for reports
const monthlyCheckouts = [
  { month: "Jan", checkouts: 45, returns: 42 },
  { month: "Feb", checkouts: 52, returns: 48 },
  { month: "Mar", checkouts: 38, returns: 41 },
  { month: "Apr", checkouts: 61, returns: 58 },
  { month: "May", checkouts: 55, returns: 52 },
  { month: "Jun", checkouts: 67, returns: 61 },
];

const popularBooks = [
  {
    title: "The Purpose Driven Life",
    author: "Rick Warren",
    checkouts: 23,
    category: "Christian Living",
  },
  {
    title: "Jesus Calling",
    author: "Sarah Young",
    checkouts: 19,
    category: "Devotional",
  },
  {
    title: "Mere Christianity",
    author: "C.S. Lewis",
    checkouts: 16,
    category: "Apologetics",
  },
  {
    title: "The Case for Christ",
    author: "Lee Strobel",
    checkouts: 14,
    category: "Apologetics",
  },
  {
    title: "Crazy Love",
    author: "Francis Chan",
    checkouts: 12,
    category: "Christian Living",
  },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("6months");

  const maxCheckouts = Math.max(...monthlyCheckouts.map((m) => m.checkouts));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Insights and statistics for your berea-cms"
      >
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Checkouts
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">318</div>
              <p className="text-xs text-muted-foreground">
                +12% from last period
              </p>
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
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +5% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last period
              </p>
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
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">-4 from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>
                  Book checkouts and returns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyCheckouts.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-gray-500">
                          {month.checkouts} checkouts, {month.returns} returns
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-gray-500">
                            Checkouts
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                  width: `${
                                    (month.checkouts / maxCheckouts) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-8 text-xs text-right">
                            {month.checkouts}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-gray-500">
                            Returns
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${
                                    (month.returns / maxCheckouts) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-8 text-xs text-right">
                            {month.returns}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Books */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Books</CardTitle>
                <CardDescription>
                  Books with the highest checkout frequency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularBooks.map((book, index) => (
                    <div
                      key={book.title}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{book.title}</div>
                        <div className="text-sm text-gray-500">
                          by {book.author}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{book.category}</Badge>
                        <div className="text-sm font-medium">
                          {book.checkouts} checkouts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Average checkout duration
                    </span>
                    <span className="font-medium">18 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Books added this month
                    </span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      New members this month
                    </span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Most popular day
                    </span>
                    <span className="font-medium">Sunday</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Collection utilization
                    </span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
