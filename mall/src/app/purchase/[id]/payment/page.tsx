"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { products } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PaymentMethod = "신용카드" | "카카오페이" | "네이버페이" | "토스페이" | "휴대폰결제";

const paymentMethods: { id: PaymentMethod; color: string; emoji: string }[] = [
  { id: "신용카드", color: "bg-blue-500", emoji: "💳" },
  { id: "카카오페이", color: "bg-yellow-400", emoji: "💛" },
  { id: "네이버페이", color: "bg-green-500", emoji: "💚" },
  { id: "토스페이", color: "bg-blue-400", emoji: "💙" },
  { id: "휴대폰결제", color: "bg-gray-500", emoji: "📱" },
];

const coupons = [
  { id: "c1", name: "5,000원 할인 쿠폰", discount: 5000, type: "amount" as const },
  { id: "c2", name: "10% 할인 쿠폰", discount: 10, type: "percent" as const },
];

function PaymentContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const recipientName = searchParams.get("name") || "수신자";
  const quantity = Number(searchParams.get("qty")) || 1;

  const product = products.find((p) => p.id === id);

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("카카오페이");
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [points, setPoints] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [orderExpanded, setOrderExpanded] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">상품을 찾을 수 없습니다</p>
      </div>
    );
  }

  const basePrice = product.price * quantity;
  const coupon = coupons.find((c) => c.id === selectedCoupon);
  const couponDiscount =
    coupon
      ? coupon.type === "amount"
        ? coupon.discount
        : Math.floor((basePrice * coupon.discount) / 100)
      : 0;
  const pointDiscount = Math.min(Number(points) || 0, basePrice - couponDiscount);
  const finalPrice = basePrice - couponDiscount - pointDiscount;

  const handlePayment = () => {
    router.push(`/purchase/complete?name=${encodeURIComponent(recipientName)}&price=${finalPrice}`);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-12 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-700">
          <ChevronLeft size={22} />
        </button>
        <span className="text-base font-bold text-gray-900">결제</span>
      </div>

      {/* Stepper */}
      <div className="bg-white px-4 py-3 flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center">
            1
          </div>
          <span className="text-sm font-medium text-gray-400">수신자정보</span>
        </div>
        <div className="h-px flex-1 bg-primary" />
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
            2
          </div>
          <span className="text-sm font-semibold text-primary">결제</span>
        </div>
      </div>

      <div className="px-4 space-y-3 mt-2 pb-28">
        {/* Order Summary (collapsible) */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <button
            onClick={() => setOrderExpanded(!orderExpanded)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-primary" />
              <span className="text-sm font-semibold text-gray-900">주문 상품</span>
              <span className="text-sm text-gray-400">{product.name}</span>
            </div>
            {orderExpanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </button>
          {orderExpanded && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">상품명</span>
                  <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">브랜드</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">수량</span>
                  <span className="text-gray-900">{quantity}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">수신자</span>
                  <span className="text-gray-900">{recipientName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">결제 수단</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label key={method.id} className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={() => setSelectedPayment(method.id)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedPayment === method.id
                      ? "border-primary"
                      : "border-gray-300"
                  )}
                >
                  {selectedPayment === method.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-lg">{method.emoji}</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedPayment === method.id ? "text-gray-900" : "text-gray-600"
                  )}
                >
                  {method.id}
                </span>
                {selectedPayment === method.id && (
                  <span className="ml-auto text-xs text-primary font-semibold">선택됨</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Coupon & Points */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">할인/쿠폰</h3>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">쿠폰 선택</label>
            <select
              value={selectedCoupon}
              onChange={(e) => setSelectedCoupon(e.target.value)}
              className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none focus:border-primary"
            >
              <option value="">쿠폰을 선택하세요</option>
              {coupons.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500">포인트 사용</label>
              <span className="text-xs text-gray-400">보유: 1,250P</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="0"
                min={0}
                max={1250}
                className="flex-1 h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-primary"
              />
              <button
                onClick={() => setPoints("1250")}
                className="px-3 h-11 text-xs font-semibold text-primary border border-primary rounded-xl hover:bg-primary-50 transition-colors"
              >
                전액사용
              </button>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl p-4 space-y-2.5">
          <h3 className="text-sm font-bold text-gray-900">결제 금액</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">상품금액</span>
            <span className="text-gray-900">{formatPrice(product.originalPrice * quantity)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">상품 할인</span>
            <span className="text-green-600">
              -{formatPrice((product.originalPrice - product.price) * quantity)}
            </span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">쿠폰 할인</span>
              <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
            </div>
          )}
          {pointDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">포인트 사용</span>
              <span className="text-green-600">-{formatPrice(pointDiscount)}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2.5 flex justify-between">
            <span className="text-sm font-bold text-gray-900">최종결제금액</span>
            <span className="text-base font-black text-primary">{formatPrice(finalPrice)}</span>
          </div>
        </div>

        {/* Agreement */}
        <label className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-gray-600">
            결제 내용을 확인하였으며, 구매에 동의합니다
          </span>
        </label>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handlePayment}
          disabled={!agreed}
          className="h-12 text-base"
        >
          결제하기 {formatPrice(finalPrice)}
        </Button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
