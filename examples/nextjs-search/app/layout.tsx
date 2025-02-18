import { UniformContext } from "@uniformdev/canvas-next-rsc";
import { Inter } from "next/font/google";

import "./styles/globals.css";
import { UniformClientContext } from "@/uniform/clientContext";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.mywebsite.com`),
  title: {
    template: "%s | My Website",
    default: ` My Website`,
  },
  alternates: {
    canonical: "./",
  },
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
