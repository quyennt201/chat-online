import type { ReactNode } from "react";

export interface IAppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: IAppLayoutProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
