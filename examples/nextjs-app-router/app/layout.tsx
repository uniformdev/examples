import { UniformContext } from "@uniformdev/canvas-next-rsc";
import { Inter } from "next/font/google";

import "./globals.css";
import { UniformClientContext } from "@/uniform/clientContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="main">
          <UniformContext clientContextComponent={UniformClientContext}>
            {children}
          </UniformContext>
        </main>
      </body>
    </html>
  );
}
