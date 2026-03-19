import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUser";
import { BASE_URL } from ".";
import { toast } from "react-toastify";
import type { Conversation } from "../../types/conversation.type";

export function useCreateConversation() {
    const accessToken = useUserStore((state) => state.accessToken)
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ receiverId }: { receiverId: string }) => {
            const res = await fetch(`${BASE_URL}/conversation`, {
                method: "POST",
                body: JSON.stringify({ receiverId }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            })

            if (!res.ok) {
                throw new Error("Failed to create conversation")
            }

            const data = await res.json();
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create conversation");
        },
    });
}

export function useGetConversationsMe() {
    const accessToken = useUserStore((state) => state.accessToken)

    return useQuery({
        queryKey: ["conversations", accessToken],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/conversation/me`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            })

            if (!res.ok) {
                throw new Error("Failed to get conversations")
            }

            const data: Conversation[] = await res.json();
            return data;
        },
    });
}

export function useGetConversationById(conversationId: string) {
    const accessToken = useUserStore((state) => state.accessToken)

    return useQuery({
        queryKey: ["conversation", conversationId, accessToken],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/conversation/${conversationId}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            })
            if (!res.ok) {
                throw new Error("Failed to get conversation")
            }

            const data: Conversation = await res.json();
            return data;
        },
        enabled: !!conversationId && !!accessToken,
    });
}

