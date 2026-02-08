import {
  Edit,
  Loader2Icon,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/page-header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import useMembers from "../../hooks/members/useMembers";
import { useAuth } from "../../provider/AuthProvider";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { DialogHeader, DialogFooter } from "../../components/ui/dialog";
import useDeleteMember from "../../hooks/members/useDeleteMembers";

export default function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending } = useDeleteMember();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Members"
        description="Manage your berea-cms members"
      >
        <Button asChild>
          <Link to="/members/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-3/5 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search members by name or email..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
              {isLoading ? (
                <div className="w-full">
                  <div>
                    <Skeleton className="mb-4 h-10 rounded" />
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <Skeleton key={idx} className="mb-2 h-8 rounded" />
                    ))}
                  </div>
                </div>
              ) : (
                <Table className="overflow-hidden">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Contact
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Member Since
                      </TableHead>
                      <TableHead>Books Out</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members &&
                      members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500 md:hidden">
                                <div className="flex items-center">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3" />
                                {member.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="mr-1 h-3 w-3" />
                                {member.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {new Date(member.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {member.checkouts.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.role[0].toUpperCase() +
                              member.role.slice(1)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {user?.id === member.id ? (
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  title="Edit your profile"
                                >
                                  <Link to="/settings">
                                    <Edit />
                                  </Link>
                                </Button>
                              ) : (
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  title="Edit member"
                                >
                                  <Link
                                    to={`/members/${member.id}/edit`}
                                    state={{ member }}
                                  >
                                    <Edit />
                                  </Link>
                                </Button>
                              )}
                              {user?.id !== member.id && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="w-fit justify-start"
                                      variant="ghost"
                                      onClick={() => setOpen(true)}
                                      title="Delete book"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="w-fit font-[poppins]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Are you absolutely sure?
                                      </DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete member data from our
                                        servers.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose
                                        onClick={() => {
                                          setOpen(false);
                                        }}
                                        asChild
                                      >
                                        <Button
                                          variant={"ghost"}
                                          disabled={isPending}
                                        >
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        variant={"destructive"}
                                        disabled={isPending}
                                        onClick={() => {
                                          mutate({ id: member.id });
                                          setOpen(false);
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
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
