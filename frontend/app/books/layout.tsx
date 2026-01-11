import { ReactNode } from "react";
import Header from "@/components/frontpage/Header1";
import Footer from "@/components/frontpage/Footer";

const bookLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default bookLayout;
