import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import useEditMember from "../../hooks/members/useEditMember";
import useMember from "../../hooks/members/useMember";
import MemberSchema, { type MemberFormData } from "../../models/MemberSchema";
import { useAuth } from "../../provider/AuthProvider";

export default function EditMemberPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberFromState = location.state?.member;
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      name: memberFromState?.name || "",
      email: memberFromState?.email || "",
      phone: memberFromState?.phone || "",
      role: memberFromState?.role || "user",
    },
  });

  const role = watch("role");
  const { mutate, isPending } = useEditMember();
  const {
    data: member,
    isLoading,
    error,
  } = useMember(!memberFromState ? id : undefined);

  useEffect(() => {
    if (memberFromState) {
      reset({
        name: memberFromState.name,
        email: memberFromState.email,
        phone: memberFromState.phone,
        role: memberFromState.role || "user",
      });
    } else if (member) {
      reset({
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role || "user",
      });
    }
  }, [memberFromState, member, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch member");
      navigate("/members");
    }
  }, [error, navigate]);

  const onSubmit = (data: MemberFormData) => {
    mutate(
      { id: id!, ...data },
      {
        onSuccess: () => {
          toast.success("Member updated successfully!");
          navigate("/members");
        },
      },
    );
  };

  if (isLoading && !memberFromState)
    return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Member" description="Update member information">
        <Button variant="outline" asChild>
          <Link to="/members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Link>
        </Button>
      </PageHeader>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Edit Member</CardTitle>
              <CardDescription>
                Update the member by editing the following information
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
                    <p className="my-2 text-xs text-red-400">
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
                    <p className="my-2 text-xs text-red-400">
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
                    <p className="my-2 text-xs text-red-400">
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
                          value as "admin" | "librarian" | "user",
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
                      <div className="mt-2 text-xs text-red-400">
                        <p>{errors.role.message}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-10 flex items-center justify-end gap-5">
                  <Button variant={"outline"} asChild>
                    <Link to={"/members"}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {!isPending ? (
                      "Save Changes"
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
}
