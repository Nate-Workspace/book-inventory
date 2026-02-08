import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";

const layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);

  return (
    <div className="min-h-screen font-[poppins] bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="flex-1 pt-6 pb-20">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default layout;
