import { useUniformContext } from "@uniformdev/context-react";
import { testVariations } from "@uniformdev/context";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const defaultFont = Inter({ subsets: ["latin"] });

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

const fontVariants = [
  { id: "roboto", font: roboto },
  { id: "roboto-mono", font: robotoMono },
];

import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const { context } = useUniformContext();
  const variant = testVariations({
    name: "fontTest",
    context,
    variations: fontVariants,
  });
  console.log({ selectedFont: variant?.result ?? "default (Inter)" });
  return (
    <main className={variant?.result?.font.className ?? defaultFont.className}>
      <div className="leading-normal tracking-normal text-white gradient">
        <Navbar />
        {children}
        <Footer />
      </div>
    </main>
  );
};
