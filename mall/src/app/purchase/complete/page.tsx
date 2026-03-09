"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

function CompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const recipientName = searchParams.get("name") || "수신자";
  const price = Number(searchParams.get("price")) || 0;
  const orderNumber = `PG${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle size={52} className="text-green-500" strokeWidth={1.5} />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-black text-gray-900 mb-2">결제가 완료되었습니다!</h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        상품권이{" "}
        <span className="font-bold text-gray-800">{recipientName}</span>
        님께 발송되었습니다
      </p>

      {/* Order Info Card */}
      <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 mb-8 text-left space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">주문번호</span>
          <span className="font-semibold text-gray-900 font-mono">{orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">수신자</span>
          <span className="font-semibold text-gray-900">{recipientName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">결제금액</span>
          <span className="font-bold text-primary">{formatPrice(price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">발송 방법</span>
          <span className="font-semibold text-gray-900">카카오톡</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full space-y-2.5">
        <Link href="/vouchers" className="block">
          <Button variant="primary" fullWidth size="lg" className="h-12 text-base">
            상품권 확인하기
          </Button>
        </Link>
        <Button
          variant="outline"
          fullWidth
          size="lg"
          className="h-12 text-base"
          onClick={() => router.push("/")}
        >
          홈으로
        </Button>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-400 mt-6 leading-relaxed">
        카카오톡 메시지가 도착하지 않은 경우<br />
        주문 내역에서 다시 발송할 수 있습니다
      </p>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>}>
      <CompleteContent />
    </Suspense>
  );
}
