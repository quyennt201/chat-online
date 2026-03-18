import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AppLayout from "../components/layout/AppLayout";
import { useUserStore } from "../store/useUser";
import { Navigate } from "react-router-dom";

export default function AuthPage() {
  const [selected, setSelected] = useState("login");

  const accessToken = useUserStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <AppLayout>
      {selected === "login" && (
        <LoginForm onClickRegister={() => setSelected("register")} />
      )}
      {selected === "register" && (
        <RegisterForm onClickLogin={() => setSelected("login")} />
      )}
    </AppLayout>
  );
}
