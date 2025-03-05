import { UniformContext } from "@uniformdev/canvas-next-rsc";
import { Inter } from "next/font/google";
import { UniformClientContext } from "@/uniform/clientContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Uniform Example app",
  description: "Uniform Example app",
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
