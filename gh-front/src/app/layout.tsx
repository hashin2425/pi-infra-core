import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.scss";

const mainFont = Noto_Sans_JP({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "pi-infra-dashboard",
  description: "pi-infra-dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={mainFont.className}>
        <div className="min-w-[400px]">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
