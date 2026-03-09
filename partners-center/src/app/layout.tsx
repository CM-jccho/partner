import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "PONGIFT Partners Center",
  description: "폰기프트 파트너스 센터 - 모바일 상품권 관리 콘솔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-[#F8F9FA] text-gray-900">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
