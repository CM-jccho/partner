"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, ChevronRight } from "lucide-react";
import { vouchers, type VoucherStatus } from "@/data/mock";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TabFilter = "전체" | "사용가능" | "사용완료" | "만료됨";

const tabs: TabFilter[] = ["전체", "사용가능", "사용완료", "만료됨"];

const statusBadgeVariant = (status: VoucherStatus) => {
  switch (status) {
    case "ISSUED": return "info" as const;
    case "DELIVERED": return "success" as const;
    case "REDEEMED": return "default" as const;
    case "EXPIRED": return "danger" as const;
  }
};

const statusLabel = (status: VoucherStatus) => {
  switch (status) {
    case "ISSUED": return "발행됨";
    case "DELIVERED": return "전달완료";
    case "REDEEMED": return "사용완료";
    case "EXPIRED": return "만료됨";
  }
};

const isUsable = (status: VoucherStatus) =>
  status === "ISSUED" || status === "DELIVERED";

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("전체");

  const filtered = vouchers.filter((v) => {
    switch (activeTab) {
      case "사용가능": return isUsable(v.status);
      case "사용완료": return v.status === "REDEEMED";
      case "만료됨": return v.status === "EXPIRED";
      default: return true;
    }
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Title */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black text-gray-900">내 상품권</h1>
        <p className="text-sm text-gray-400 mt-0.5">보유 중인 모바일 상품권 관리</p>
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

      {/* Voucher List */}
      <div className="px-4 py-3 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Gift size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium">상품권이 없습니다</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === "전체"
                ? "아직 구매한 상품권이 없어요"
                : `${activeTab} 상품권이 없습니다`}
            </p>
            <Link
              href="/products"
              className="mt-4 text-primary text-sm font-semibold hover:underline"
            >
              상품권 구경하기
            </Link>
          </div>
        ) : (
          filtered.map((voucher) => (
            <Link key={voucher.id} href={`/vouchers/${voucher.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Voucher Header */}
                <div
                  className={cn(
                    "px-4 py-3 flex items-center justify-between",
                    voucher.status === "EXPIRED" || voucher.status === "REDEEMED"
                      ? "bg-gray-100"
                      : "bg-gradient-to-r from-primary to-accent"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      voucher.status === "EXPIRED" || voucher.status === "REDEEMED"
                        ? "text-gray-400"
                        : "text-white"
                    )}
                  >
                    {voucher.brand}
                  </span>
                  <Badge variant={statusBadgeVariant(voucher.status)} size="sm">
                    {statusLabel(voucher.status)}
                  </Badge>
                </div>

                {/* Voucher Body */}
                <div className="px-4 py-3">
                  <p
                    className={cn(
                      "text-sm font-semibold mb-1 leading-tight",
                      voucher.status === "EXPIRED" || voucher.status === "REDEEMED"
                        ? "text-gray-400"
                        : "text-gray-900"
                    )}
                  >
                    {voucher.productName}
                  </p>
                  <p className="text-xl font-black text-gray-900 mb-2">
                    {formatPrice(voucher.faceValue)}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      만료일: {formatDate(voucher.expiryDate)}
                    </p>
                    {isUsable(voucher.status) ? (
                      <span className="text-xs font-semibold text-primary flex items-center gap-0.5">
                        사용하기
                        <ChevronRight size={12} />
                      </span>
                    ) : (
                      <ChevronRight size={16} className="text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
