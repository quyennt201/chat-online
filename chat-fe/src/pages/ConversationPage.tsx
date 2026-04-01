import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreateConversation,
  useGetConversationById,
} from "../lib/hooks/useConversation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import ChatScreen from "../components/chat/ChatScreen";

export default function ConversationPage() {
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();
  const receiverId = location.state?.receiverId ?? "";
  const { conversationId } = useParams();
  const { mutateAsync: createConversation, isPending: isCreatingConversation } =
    useCreateConversation();
  const { data: conversation } = useGetConversationById(conversationId ?? "");

  useEffect(() => {
    if (conversation) {
      console.log(conversation);
    }
  }, [conversation]);

  const handleCreateConversation = async () => {
    if (!receiverId) {
      toast.error("Receiver ID is required");
      return;
    }

    try {
      const res = await createConversation({ receiverId });
      navigate(`/conversations/${res._id}`);
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    } catch {
      toast.error("Failed to create conversation");
    }
  };

  return (
    <div className="size-full p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
      {!conversationId ? (
        <button
          onClick={handleCreateConversation}
          disabled={isCreatingConversation}
          className="w-full p-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          {isCreatingConversation ? "Creating..." : "Create Conversation"}
        </button>
      ) : (
        <ChatScreen conversationId={conversationId} />
      )}
    </div>
  );
}
