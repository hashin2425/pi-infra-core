import "./globals.css";

export const metadata = {
  title: "User Management App",
  description: "A Next.js app with Redis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
