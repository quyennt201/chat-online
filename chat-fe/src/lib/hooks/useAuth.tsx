import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from ".";
import { useUserStore } from "../../store/useUser";

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  accessToken: string;
  user: {
    _id: string;
  };
}

export const useLogin = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ username, password }: ILoginPayload) => {
      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Login failed");
        }

        const data: UserLoginResponse = await res.json();
        setUser(data.accessToken, data.user._id);
        return data;
      } catch {
        throw new Error("Login failed");
      }
    },
  });
};

export const useRegister = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ username, password }: ILoginPayload) => {
      try {
        const res = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Login failed");
        }

        const data: UserLoginResponse = await res.json();

        setUser(data.accessToken, data.user._id);
        return data;
      } catch {
        throw new Error("Login failed");
      }
    },
  });
};
