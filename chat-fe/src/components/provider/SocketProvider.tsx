import { useEffect } from "react";
import { socket } from "../../lib/socket";

export const SocketProvider = ({ userId, children }: { userId: string | null, children: React.ReactNode }) => {

    useEffect(() => {
        if (!userId) return;

        socket.connect();

        socket.on("connect", () => {
            socket.emit("addUser", userId);
        });

        return () => {
            socket.disconnect();
            socket.off("connect");
        };
    }, [userId]);

    return children;
};