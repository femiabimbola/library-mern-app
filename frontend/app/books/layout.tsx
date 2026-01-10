import { ReactNode } from "react";
import Header from "@/components/frontpage/Header1";

const bookLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <Header />
      {children}
    </main>
  );
};

export default bookLayout;
