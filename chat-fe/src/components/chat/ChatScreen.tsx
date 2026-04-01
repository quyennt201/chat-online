import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "../../store/useUser";
import { socket } from "../../lib/socket";
import { ArrowLeftIcon } from "lucide-react";
import clsx from "clsx";
import type { Message } from "../../types/message";
import { useGetConversationById } from "../../lib/hooks/useConversation";
import { useNavigate } from "react-router-dom";
import { useSendMessage } from "../../lib/hooks/useMessage";

export default function ChatScreen({
  conversationId,
}: {
  conversationId: string;
}) {
  const navigate = useNavigate();

  const [onlineUsers, setOnlineUsers] = useState<
    Array<{ userId: string; socketId: string }>
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const { data: conversation } = useGetConversationById(conversationId);
  const userId = useUserStore((state) => state.userId);
  const { mutateAsync } = useSendMessage();
  console.log(conversation);
  const currentUser = conversation?.members.find((m) => m._id !== userId);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) {
      return;
    }

    try {
      await mutateAsync({ conversationId, text });

      const sentMessage = {
        text,
        senderId: userId || "",
        conversationId,
        _id: "",
        updatedAt: "",
        createdAt: "",
      };

      setMessages((prev) =>
        !prev?.length ? [sentMessage] : [...prev, sentMessage],
      );
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }

    // socket.emit("sendMessage", {
    //   senderId: userId,
    //   receiverId: currentUser,
    //   text: text.trim(),
    // });
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessages((prev) => (!prev?.length ? [data] : [...prev, data]));
    });

    return () => {
      socket.off("getMessage");
    };
  }, []);

  useEffect(() => {
    socket.on("getOnlineUsers", (users) => {
      if (!users) {
        toast("Dont't get online users");
        return;
      }

      setOnlineUsers(users);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, []);

  useEffect(() => {
    setMessages(conversation?.messages || []);
  }, [conversation?.messages]);

  return (
    <div className="size-full flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="text-sm cursor-pointer hover:text-purple-500 transition"
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-full bg-linear-to-bl from-cyan-200 to-sky-600 relative">
            <div
              className={clsx(
                "absolute bottom-0.5 right-0.5 z-10 size-2 shadow rounded-full",
                onlineUsers.some((u) => u.userId === currentUser?._id)
                  ? "bg-green-500"
                  : "bg-gray-400",
              )}
            />
          </div>
          <p className="text-purple-500 font-medium">{currentUser?.username}</p>
        </div>
      </div>
      <div className="flex-1 p-4 border border-white/10 rounded-2xl overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg  ${msg.senderId === userId ? "bg-purple-500" : "bg-sky-500"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-4">
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="flex-1 px-5 py-3 border border-white/15 bg-white/15 rounded-lg focus:outline-none"
        />
        <button type="submit" className="px-3 py-3 rounded-lg bg-sky-500">
          Send
        </button>
      </form>
    </div>
  );
}
