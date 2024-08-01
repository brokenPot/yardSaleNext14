import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | yard sale",
        default: "yard sale",
    },
    description: "Sell and buy all the things!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      </head>
      <body className={` bg-neutral-900 text-white max-w-screen-sm mx-auto`}>
      {children}
      </body>
      </html>
  );
}
