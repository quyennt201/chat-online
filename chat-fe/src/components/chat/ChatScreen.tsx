import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "../../store/useUser";
import { socket } from "../../lib/socket";
import type User from "../../types/user.type";
import { ArrowLeftIcon } from "lucide-react";
import clsx from "clsx";
import type { Message } from "../../types/message";

export default function ChatScreen() {
  const userId = useUserStore((state) => state.userId);
  const [onlineUsers, setOnlineUsers] = useState<
    Array<{ userId: string; socketId: string }>
  >([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log("mess", data);
      setMessages((prev) => !prev?.length ? [data] : [...prev, data]);
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

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) {
      return;
    }

    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: currentUser,
      text: text.trim(),
    });

    setText("");
  };

  return (
    <div className="max-w-7xl w-[90vw] h-[80vh] border border-white/10 bg-white/5 backdrop-blur-2xl rounded-xl p-8">
      <div className="size-full flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentUser(undefined)} className="text-sm cursor-pointer hover:text-purple-500 transition">
            <ArrowLeftIcon className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-linear-to-bl from-cyan-200 to-sky-600 relative" >
              <div className={clsx("absolute bottom-0.5 right-0.5 z-10 size-2 shadow rounded-full", onlineUsers.some((u) => u.userId === currentUser?._id) ? 'bg-green-500' : 'bg-gray-400')} />
            </div>
            <p className="text-purple-500 font-medium">{currentUser?.username}</p>
          </div>
        </div>
        <div className="flex-1 p-4 border border-white/10 rounded-2xl overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
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
          <button
            type="submit"
            className="px-3 py-3 rounded-lg bg-sky-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
