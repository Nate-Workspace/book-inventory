import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useBooks from "../../hooks/book/useBooks";
import useMembers from "../../hooks/members/useMembers";
import { cn } from "../../lib/utils";
import { CheckoutSchema } from "../../models/CheckoutSchema";
import type Member from "../../models/Member";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import useAddCheckout from "../../hooks/checkout/useAddCheckout";

export function CheckoutForm({
  bookId,
  bookTittle,
  userId,
}: {
  bookId?: number;
  bookTittle?: string;
  userId?: number;
}) {
  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      book_id: bookId ?? undefined,
      user_id: userId ?? undefined,
      return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    },
  });

  // Hooks for users and books
  const { data: members = [], isLoading: usersLoading } = useMembers();
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState(bookTittle ?? "");
  const [debouncedBookSearch, setDebouncedBookSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Member[]>([]);

  const { mutate, isPending } = useAddCheckout();

  // Debounce book search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBookSearch(bookSearch);
    }, 350);
    return () => clearTimeout(handler);
  }, [bookSearch]);

  // UseBooks with debounced search
  const { data: booksData, isLoading: booksLoading } = useBooks({
    page: 1,
    title: debouncedBookSearch,
  });

  // Client-side search for users
  const handleUserSearch = (term: string) => {
    setUserSearch(term);
    if (members.length > 0) {
      const results = members.filter(
        (u) =>
          u.name.toLowerCase().includes(term.toLowerCase()) ||
          u.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(results);
      // If no results, you could trigger a backend search here
    }
  };

  // Book search input handler (debounced backend search)
  const handleBookSearch = (term: string) => {
    setBookSearch(term);
  };

  async function onSubmit(data: z.infer<typeof CheckoutSchema>) {
    mutate({ data });
  }

  if (booksLoading && usersLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          disabled={usersLoading}
          name="user_id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>User</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? members.find((user) => user.id === field.value)?.name
                        : "Select user"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search user..."
                      className="h-9"
                      value={userSearch}
                      onValueChange={handleUserSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {(userSearch ? filteredUsers : members).map((user) => (
                          <CommandItem
                            value={user.name}
                            key={user.id}
                            onSelect={() => {
                              form.setValue("user_id", user.id);
                            }}
                          >
                            {user.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          disabled={booksLoading}
          name="book_id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Book</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? booksData?.data?.find(
                            (book) => book.id === field.value
                          )?.title
                        : "Select book"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search book..."
                      className="h-9"
                      value={bookSearch}
                      onValueChange={handleBookSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No book found.</CommandEmpty>
                      <CommandGroup>
                        {(() => {
                          const books = booksData?.data ?? [];
                          let displayBooks = books;
                          // If searching, filter books
                          if (bookSearch) {
                            displayBooks = books.filter(
                              (b) =>
                                b.title
                                  .toLowerCase()
                                  .includes(bookSearch.toLowerCase()) ||
                                b.author
                                  .toLowerCase()
                                  .includes(bookSearch.toLowerCase())
                            );
                          }
                          // Ensure selected book is always present
                          const selectedBook = books.find(
                            (b) => b.id === field.value
                          );
                          if (
                            selectedBook &&
                            !displayBooks.some((b) => b.id === selectedBook.id)
                          ) {
                            displayBooks = [selectedBook, ...displayBooks];
                          }
                          return displayBooks.map((book) => (
                            <CommandItem
                              value={book.title}
                              key={book.id}
                              onSelect={() => {
                                form.setValue("book_id", book.id);
                              }}
                            >
                              {book.title}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  book.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ));
                        })()}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="return_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  min={new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 10)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          className="w-full justify-self-end"
          type="submit"
        >
          {!isPending ? "Checkout" : <Loader2Icon className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
