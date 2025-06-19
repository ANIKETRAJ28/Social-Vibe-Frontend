import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { IPost } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuthStore((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    const user = auth.getUser();
    if (user.user_id === null) {
      try {
        async function verifyUser() {
          await auth.verifyUser();
        }
        verifyUser();
      } catch (error) {
        toast({
          title: "Please login",
          description: "You need to login to access this page.",
          variant: "destructive",
        });
        navigate("/login");
      }
    }
  }, [auth, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
