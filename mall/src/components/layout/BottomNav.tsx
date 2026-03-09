"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Gift, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/products", icon: Search, label: "탐색" },
  { href: "/vouchers", icon: Gift, label: "상품권" },
  { href: "/orders", icon: ShoppingBag, label: "주문" },
  { href: "/mypage", icon: User, label: "마이" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="max-w-[430px] mx-auto h-16 flex items-center">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors",
                active ? "text-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={cn(active ? "text-primary" : "text-gray-400")}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-primary" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
