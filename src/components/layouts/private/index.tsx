import type React from "react";
import Header from "./Header";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <main className="w-full h-full">
      <Header />
      {children}
    </main>
  );
};

export default PrivateLayout;
