"use client";
import React from "react";
import UserLayout from "@/components/layouts/UserLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import { AuthContext } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";

export default function SecureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided");
  }

  const { validateToken, user } = authContext;

  React.useEffect(() => {
    const checkToken = async () => {
      setLoading(true);

      try {
        const isValid = await validateToken();
        if (!isValid) {
          // router.push("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [validateToken, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Validando accesos...
      </div>
    );
  }

  return (
    <div>
      {user?.role === "admin" && <AdminLayout>{children}</AdminLayout>}
      {user?.role === "user" && <UserLayout>{children}</UserLayout>}
    </div>
  );
}
