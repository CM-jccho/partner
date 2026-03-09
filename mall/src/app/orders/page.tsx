"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { orders, type OrderStatus } from "@/data/mock";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TabFilter = "전체" | "결제완료" | "취소";

const tabs: TabFilter[] = ["전체", "결제완료", "취소"];

const statusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "PAID": return "success" as const;
    case "CREATED": return "info" as const;
    case "CANCELED": return "danger" as const;
  }
};

const statusLabel = (status: OrderStatus) => {
  switch (status) {
    case "PAID": return "결제완료";
    case "CREATED": return "주문접수";
    case "CANCELED": return "취소됨";
  }
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("전체");

  const filtered = orders.filter((o) => {
    switch (activeTab) {
      case "결제완료": return o.status === "PAID" || o.status === "CREATED";
      case "취소": return o.status === "CANCELED";
      default: return true;
    }
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Title */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black text-gray-900">주문 내역</h1>
        <p className="text-sm text-gray-400 mt-0.5">구매한 상품권의 주문 현황</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors border-b-2",
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="px-4 py-3 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium">주문 내역이 없습니다</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === "전체"
                ? "아직 주문한 상품이 없어요"
                : `${activeTab} 내역이 없습니다`}
            </p>
            <Link
              href="/products"
              className="mt-4 text-primary text-sm font-semibold hover:underline"
            >
              상품권 구매하기
            </Link>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs font-mono text-gray-500">{order.orderNumber}</p>
                </div>
                <Badge variant={statusBadgeVariant(order.status)} size="sm">
                  {statusLabel(order.status)}
                </Badge>
              </div>

              {/* Order Body */}
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={22} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">{order.brand}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                    {order.productName}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-base font-black text-gray-900">
                      {formatPrice(order.price)}
                    </p>
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-0.5 text-xs text-primary font-semibold"
                    >
                      주문 상세
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
