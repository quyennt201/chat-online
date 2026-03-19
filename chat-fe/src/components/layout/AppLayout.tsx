import type { ReactNode } from "react";
import { SocketProvider } from "../provider/SocketProvider";
import { useUserStore } from "../../store/useUser";

export interface IAppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: IAppLayoutProps) {
  const userId = useUserStore((state) => state.userId);
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <SocketProvider userId={userId}>
        <div className="max-w-7xl w-[90vw] h-[80vh] border border-white/10 bg-white/5 backdrop-blur-2xl rounded-xl p-8">{children}</div>
      </SocketProvider>
    </div>
  );
}
