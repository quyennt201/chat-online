import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUser";
import { BASE_URL } from ".";
import { toast } from "react-toastify";

export function useSendMessage() {
  const accessToken = useUserStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      text,
    }: {
      conversationId: string;
      text: string;
    }) => {
      const res = await fetch(
        `${BASE_URL}/conversation/send/${conversationId}`,
        {
          method: "POST",
          body: JSON.stringify({ text }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
}
