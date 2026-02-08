import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { Loader2Icon } from "lucide-react";

const ProtectedRoutes = () => {
  const { user, fetchState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchState === "ready") {
      if (!user) navigate("/login");
    }
  }, [user, fetchState === "notReady"]);

  if (fetchState === "notReady")
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoutes;
