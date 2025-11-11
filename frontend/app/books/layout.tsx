import { ReactNode } from "react";
import Header from "@/components/user/Header";
const bookLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <Header />
      {children}
    </main>
  );
};

export default bookLayout;
