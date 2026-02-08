import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { Loader2Icon } from "lucide-react";

const FormLayout = () => {
  const { user, fetchState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchState === "ready") {
      if (user) navigate("/");
    }
  }, [user]);

  if (fetchState === "notReady")
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  return <Outlet />;
};

export default FormLayout;
