"use client";

import Link from "next/link";
import {
  ChevronRight,
  ShoppingBag,
  Gift,
  Bell,
  User,
  Headphones,
  Info,
  LogOut,
  Settings,
  Star,
} from "lucide-react";
import { orders, vouchers } from "@/data/mock";

const menuItems = [
  {
    group: "주문/상품권",
    items: [
      { label: "내 주문 내역", icon: ShoppingBag, href: "/orders", color: "text-blue-500", bg: "bg-blue-50" },
      { label: "내 상품권", icon: Gift, href: "/vouchers", color: "text-green-500", bg: "bg-green-50" },
    ],
  },
  {
    group: "계정 관리",
    items: [
      { label: "알림 설정", icon: Bell, href: "/mypage/notifications", color: "text-yellow-500", bg: "bg-yellow-50" },
      { label: "개인정보 수정", icon: User, href: "/mypage/profile", color: "text-purple-500", bg: "bg-purple-50" },
      { label: "관심 상품권", icon: Star, href: "/mypage/favorites", color: "text-pink-500", bg: "bg-pink-50" },
    ],
  },
  {
    group: "기타",
    items: [
      { label: "고객센터", icon: Headphones, href: "/support", color: "text-orange-500", bg: "bg-orange-50" },
      { label: "앱 버전 정보", icon: Info, href: "/mypage/about", color: "text-gray-500", bg: "bg-gray-100" },
      { label: "환경설정", icon: Settings, href: "/mypage/settings", color: "text-gray-500", bg: "bg-gray-100" },
    ],
  },
];

export default function MyPage() {
  const totalOrders = orders.length;
  const totalVouchers = vouchers.filter(
    (v) => v.status === "ISSUED" || v.status === "DELIVERED"
  ).length;
  const points = 1250;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-4">
      {/* Profile Section */}
      <div className="bg-gradient-to-br from-primary to-accent px-4 pt-5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
            <span className="text-2xl font-black text-white">김</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white">김민지</h2>
            <p className="text-white/70 text-sm">minji@example.com</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Settings size={16} className="text-white" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <p className="text-white text-xl font-black">{totalOrders}</p>
            <p className="text-white/70 text-xs mt-0.5">주문 건</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <p className="text-white text-xl font-black">{totalVouchers}</p>
            <p className="text-white/70 text-xs mt-0.5">상품권</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <p className="text-white text-xl font-black">{points.toLocaleString()}</p>
            <p className="text-white/70 text-xs mt-0.5">적립금</p>
          </div>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="px-4 -mt-4 space-y-3">
        {menuItems.map((group) => (
          <div key={group.group} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <p className="text-xs text-gray-400 font-semibold px-4 pt-3 pb-1">{group.group}</p>
            {group.items.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  index < group.items.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon size={16} className={item.color} />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </Link>
            ))}
          </div>
        ))}

        {/* Logout */}
        <button className="w-full bg-white rounded-2xl shadow-sm flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={16} className="text-red-500" />
          </div>
          <span className="text-sm font-medium text-red-500">로그아웃</span>
        </button>

        {/* App Version */}
        <div className="text-center py-3">
          <p className="text-xs text-gray-300">퐁기프트 v1.0.0</p>
          <p className="text-xs text-gray-300 mt-0.5">
            © 2024 Pongift. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
