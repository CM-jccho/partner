"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Share2, ChevronDown, ChevronUp, MapPin, Clock, Send } from "lucide-react";
import { vouchers, products, type VoucherStatus } from "@/data/mock";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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

const usageGuide = [
  "바코드를 매장 직원에게 보여주세요",
  "스캔 후 자동으로 차감됩니다",
  "잔액이 있는 경우 재사용 가능합니다",
  "현금 교환 및 잔액 환불이 불가합니다",
  "분실 또는 도용 시 책임지지 않습니다",
];

export default function VoucherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [guideExpanded, setGuideExpanded] = useState(false);

  const voucher = vouchers.find((v) => v.id === id);

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <span className="text-4xl mb-4">😅</span>
        <p className="text-gray-600 font-medium">상품권을 찾을 수 없습니다</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary text-sm font-medium hover:underline"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const product = products.find((p) => p.id === voucher.productId);
  const isUsable = voucher.status === "ISSUED" || voucher.status === "DELIVERED";

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-12 flex items-center">
        <button onClick={() => router.back()} className="text-gray-700 mr-3">
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-base font-bold text-gray-900">상품권 상세</span>
        <button className="text-gray-700">
          <Share2 size={20} />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4 pb-28">
        {/* Voucher Visual Card */}
        <div
          className={cn(
            "rounded-3xl overflow-hidden shadow-lg",
            isUsable
              ? "bg-gradient-to-br from-primary to-accent"
              : "bg-gradient-to-br from-gray-300 to-gray-400"
          )}
        >
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-black text-lg">PONGIFT</span>
              <Badge variant={statusBadgeVariant(voucher.status)}>
                {statusLabel(voucher.status)}
              </Badge>
            </div>
            <p className="text-white/70 text-xs font-medium">{voucher.brand}</p>
            <p className="text-white font-bold text-base leading-tight mt-0.5">
              {voucher.productName}
            </p>
            <p className="text-white text-3xl font-black mt-3">
              {formatPrice(voucher.faceValue)}
            </p>
          </div>

          {/* Barcode Placeholder */}
          <div className="bg-white mx-4 mb-4 rounded-2xl p-4 flex flex-col items-center">
            {isUsable ? (
              <>
                <div className="w-full h-16 bg-gray-900 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  {/* Simulated barcode lines */}
                  <div className="flex gap-0.5 h-12">
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-gray-900"
                        style={{
                          width: i % 3 === 0 ? 3 : i % 5 === 0 ? 4 : 2,
                          backgroundColor: i % 7 === 0 ? "white" : "black",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-mono text-gray-500">{voucher.barcode}</p>
              </>
            ) : (
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl">🚫</span>
                </div>
                <p className="text-sm text-gray-400 font-medium">
                  {voucher.status === "REDEEMED" ? "이미 사용된 상품권입니다" : "만료된 상품권입니다"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">상품권 정보</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">사용처</p>
                <p className="text-sm font-medium text-gray-800">
                  {product?.usageInfo[0] || "전국 가맹점 사용 가능"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={15} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">유효기간</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(voucher.expiryDate)}까지
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] text-primary font-bold">₩</span>
              </span>
              <div>
                <p className="text-xs text-gray-400">사용가능금액</p>
                <p className="text-sm font-bold text-gray-800">
                  {voucher.status === "REDEEMED"
                    ? "0원 (사용완료)"
                    : formatPrice(voucher.faceValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage History */}
        {voucher.usageHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">사용 내역</h3>
            <div className="space-y-2">
              {voucher.usageHistory.map((usage, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{usage.location}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(usage.date).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">-{formatPrice(usage.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Guide (Accordion) */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <button
            onClick={() => setGuideExpanded(!guideExpanded)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <span className="text-sm font-semibold text-gray-900">사용 방법</span>
            {guideExpanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </button>
          {guideExpanded && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <ul className="mt-3 space-y-2">
                {usageGuide.map((guide, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {guide}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Transfer Button */}
        {isUsable && (
          <button className="w-full flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors bg-white">
            <Send size={16} />
            상품권 전달하기
          </button>
        )}
      </div>

      {/* Fixed CTA */}
      {isUsable && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3">
          <Button variant="primary" size="lg" fullWidth className="h-12 text-base">
            바코드 전체화면 보기
          </Button>
        </div>
      )}
    </div>
  );
}
