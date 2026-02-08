import { useAuth } from "../provider/AuthProvider";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { PageHeader } from "../components/page-header";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="View your account details." />
      <div className="mx-auto mt-10 max-w-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{user.name}</div>
                <div className="text-muted-foreground text-sm">
                  {user.email}
                </div>
              </div>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground text-sm">Name:</span>
                <span className="ml-2 font-medium">{user.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Email:</span>
                <span className="ml-2 font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Role:</span>
                <span className="ml-2 font-medium">{user.role}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/settings">Go to Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
