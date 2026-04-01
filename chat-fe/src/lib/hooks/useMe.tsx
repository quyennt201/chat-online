import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUser";
import { BASE_URL } from ".";

export function useMe() {
  const accessToken = useUserStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["me", accessToken],
    queryFn: async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        return data;
      } catch {
        //
      }
    },
  });
}
