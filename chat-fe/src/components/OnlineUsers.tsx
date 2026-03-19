import clsx from "clsx";
import type User from "../types/user.type";
import { useUsers } from "../lib/hooks/useUsers";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { toast } from "react-toastify";

export interface IOnlineUsersProps {
  users: {
    userId: string;
    socketId: string;
  }[];
  setCurrentUser: (user: User) => void;
}

export default function OnlineUsers() {
  const { data: allUsers } = useUsers();
  const [onlineUsers, setOnlineUsers] = useState<
    Array<{ userId: string; socketId: string }>
  >([]);

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

  if (!allUsers?.length) {
    return <div className="text-center">Not users here!</div>;
  }

  return (
    <div className="flex w-full flex-col">
      {allUsers?.map((user) => (
        <div
          className="cursor-pointer hover:bg-white/5 rounded-2xl p-4 flex items-center gap-4 w-full"
        >
          <div className="size-16 rounded-full bg-linear-to-bl from-cyan-200 to-sky-600 relative" >
            <div className={clsx("absolute bottom-1 right-1 z-10 size-3 shadow rounded-full", onlineUsers.some((u) => u.userId === user._id) ? 'bg-green-500' : 'bg-gray-400')} />
          </div>
          <div className="flex-1 space-y-1">
            <p>Username: {user.username}</p>
            {onlineUsers.some((u) => u.userId === user._id) && (
              <p>SocketId: {onlineUsers.find((u) => u.userId === user._id)?.socketId}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
