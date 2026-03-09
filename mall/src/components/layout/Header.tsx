"use client";

import { useState } from "react";
import { Search, Bell, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[430px] mx-auto h-14 flex items-center px-4">
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품권 검색..."
              className="flex-1 h-9 px-3 rounded-full bg-gray-100 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </form>
        ) : (
          <>
            <Link href="/" className="flex-1">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PONGIFT
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="검색"
              >
                <Search size={22} />
              </button>
              <button
                className="text-gray-600 hover:text-primary transition-colors relative"
                aria-label="알림"
              >
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                  3
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
