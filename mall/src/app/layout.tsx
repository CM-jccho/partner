import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "퐁기프트 - 모바일 상품권 쇼핑몰",
  description: "스타벅스, 올리브영, CGV 등 다양한 모바일 상품권을 할인된 가격에 구매하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[#FAFAFA] antialiased">
        <div className="max-w-[430px] mx-auto bg-white min-h-screen relative shadow-xl">
          <Header />
          <main className="pt-14 pb-20 min-h-screen">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
