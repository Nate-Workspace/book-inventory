import { useAuth } from "../provider/AuthProvider";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { PageHeader } from "../components/page-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserProfileSchema,
  UserPasswordSchema,
  type UserProfileFormData,
  type UserPasswordFormData,
} from "../models/UserSchema";
import useUpdateProfile from "../hooks/user/useUpdateProfile";
import useUpdatePassword from "../hooks/user/useUpdatePassword";
import { useEffect } from "react";

export default function SettingsPage() {
  const { user } = useAuth();

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { isSubmitting: isProfileSubmitting, errors: profileErrors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (user) {
      resetProfile({ name: user.name, email: user.email });
    }
  }, [user, resetProfile]);

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
  } = useForm<UserPasswordFormData>({
    resolver: zodResolver(UserPasswordSchema),
  });
  const updatePassword = useUpdatePassword();

  const onProfileSubmit = (data: UserProfileFormData) => {
    updateProfile.mutate(data);
  };

  const onPasswordSubmit = (data: UserPasswordFormData) => {
    updatePassword.mutate(data, {
      onSuccess: () => resetPassword(),
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and password."
      />
      <div className="mx-auto mt-10 max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Profile Information</div>
          </CardHeader>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...registerProfile("name")} />
                {profileErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {profileErrors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...registerProfile("email")} />
                {profileErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="mt-5"
                disabled={isProfileSubmitting || updateProfile.isPending}
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Change Password</div>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  {...registerPassword("current_password")}
                />
                {passwordErrors.current_password && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.current_password.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword("new_password")}
                />
                {passwordErrors.new_password && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.new_password.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword("new_password_confirmation")}
                />
                {passwordErrors.new_password_confirmation && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.new_password_confirmation.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="mt-5"
                disabled={isPasswordSubmitting || updatePassword.isPending}
              >
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
