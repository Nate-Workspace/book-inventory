import { ArrowLeft, Loader2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MemberSchema, { type MemberFormData } from "../../models/MemberSchema";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../provider/AuthProvider";
import { Select, SelectTrigger } from "../../components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import useAddMember from "../../hooks/members/useAddMember";
import { toast } from "sonner";

const AddMemberPage = () => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(MemberSchema),
    defaultValues: { role: "user" },
  });

  const role = watch("role");
  const { user } = useAuth();

  const { mutate, isPending } = useAddMember();

  const onSubmit = (data: MemberFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        toast.success("Member added successfully!");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Member"
        description="Add a member to the Family"
      >
        <Button variant="outline" asChild>
          <Link to="/members">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="">
            <CardHeader>
              <CardTitle>Member Info</CardTitle>
              <CardDescription>
                Add a new member by filling the following information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <Label htmlFor="name">
                    Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder="Shanko Dolche"
                    id="name"
                    className={`${errors.name && "border-red-400"}`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs my-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <Label htmlFor="email">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder="example@gmail.com"
                    id="email"
                    className={`${errors.email && "border-red-400"}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs my-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder="09 -- -- -- --"
                    id="phone"
                    type="tel"
                    className={`${errors.phone && "border-red-400"}`}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs my-2">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                {user?.role === "admin" && (
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={role}
                      onValueChange={(value) =>
                        setValue(
                          "role",
                          value as "admin" | "librarian" | "user"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.role.message}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-end mt-10 gap-5">
                  <Button variant={"outline"} asChild>
                    <Link to={"/members"}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {!isPending ? (
                      "Add Member"
                    ) : (
                      <Loader2Icon className="animate-spin" />
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
};

export default AddMemberPage;
