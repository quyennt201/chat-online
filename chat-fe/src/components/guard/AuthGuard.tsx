import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../store/useUser";
import AppLayout from "../layout/AppLayout";

export default function AuthGuard() {
  const accessToken = useUserStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/auth" />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
