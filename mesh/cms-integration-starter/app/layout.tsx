import { ReactNode } from 'react';

/**
 * Root layout for the App Router
 * This layout is used for API routes under /app/api
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
