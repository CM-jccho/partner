import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "PONGIFT CMS",
  description: "퐁기프트 플랫폼 운영 관리 콘솔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen bg-[#F0F2F5]">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-1 pt-16 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
