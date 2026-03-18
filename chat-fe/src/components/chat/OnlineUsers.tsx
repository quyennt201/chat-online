export interface IOnlineUsersProps {
  users: {
    userId: string;
    socketId: string;
  }[];
  setCurrentUser: (userId: string) => void;
}

export default function OnlineUsers({
  users,
  setCurrentUser,
}: IOnlineUsersProps) {
  if (!users.length) {
    return <div className="text-center">not online users</div>;
  }
  return (
    <div className="flex w-full flex-col">
      {users.map((user) => (
        <div
          onClick={() => setCurrentUser(user.userId)}
          className="cursor-pointer hover:bg-white/5 rounded-2xl p-4 flex items-center gap-4 w-full"
        >
          <div className="size-16 rounded-full bg-linear-to-bl from-cyan-200 to-sky-600" />
          <div className="flex-1 space-y-1">
            <p>UserId: {user.userId}</p>
            <p>SocketId: {user.socketId}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
