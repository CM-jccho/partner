"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, Circle, Package, Gift, Truck } from "lucide-react";
import { orders, type OrderStatus } from "@/data/mock";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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

interface TimelineStep {
  label: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
}

const getTimeline = (status: OrderStatus): TimelineStep[] => {
  const steps = [
    { label: "주문완료", icon: CheckCircle, completed: true, active: false },
    {
      label: "결제완료",
      icon: CheckCircle,
      completed: status === "PAID",
      active: status === "PAID",
    },
    {
      label: "상품권발행",
      icon: Gift,
      completed: status === "PAID",
      active: false,
    },
    {
      label: "전달완료",
      icon: Truck,
      completed: status === "PAID",
      active: status === "PAID",
    },
  ];
  return steps;
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <span className="text-4xl mb-4">😅</span>
        <p className="text-gray-600 font-medium">주문을 찾을 수 없습니다</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary text-sm font-medium hover:underline"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const timeline = getTimeline(order.status);
  const canCancel = order.status === "CREATED";

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-12 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-700">
          <ChevronLeft size={22} />
        </button>
        <span className="text-base font-bold text-gray-900">주문 상세</span>
      </div>

      <div className="px-4 py-4 space-y-3 pb-28">
        {/* Status Header */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400 font-mono">{order.orderNumber}</p>
            <Badge variant={statusBadgeVariant(order.status)}>
              {statusLabel(order.status)}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
        </div>

        {/* Timeline */}
        {order.status !== "CANCELED" && (
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-4">주문 진행 현황</h3>
            <div className="flex items-start">
              {timeline.map((step, index) => (
                <div key={step.label} className="flex-1 flex flex-col items-center">
                  <div className="relative flex items-center w-full">
                    {/* Connector line before */}
                    {index > 0 && (
                      <div
                        className={cn(
                          "absolute left-0 right-1/2 h-0.5",
                          timeline[index - 1].completed ? "bg-primary" : "bg-gray-200"
                        )}
                      />
                    )}
                    {/* Icon */}
                    <div className="relative z-10 w-full flex justify-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          step.completed
                            ? "bg-primary"
                            : "bg-gray-100"
                        )}
                      >
                        {step.completed ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : (
                          <Circle size={16} className="text-gray-300" />
                        )}
                      </div>
                    </div>
                    {/* Connector line after */}
                    {index < timeline.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-1/2 right-0 h-0.5",
                          step.completed ? "bg-primary" : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[10px] font-medium mt-2 text-center",
                      step.completed ? "text-primary" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">상품 정보</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{order.brand}</p>
              <p className="text-sm font-semibold text-gray-900">{order.productName}</p>
              <p className="text-sm font-bold text-primary mt-0.5">{formatPrice(order.price)}</p>
            </div>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">수신자 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">이름</span>
              <span className="font-medium text-gray-900">{order.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">연락처</span>
              <span className="font-medium text-gray-900">{order.recipientPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">메시지</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">
                {order.message}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">결제 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-mono text-xs text-gray-700">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">주문일시</span>
              <span className="text-gray-700">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제방법</span>
              <span className="text-gray-700">카카오페이</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">수량</span>
              <span className="text-gray-700">{order.quantity}개</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">결제금액</span>
              <span className="font-black text-primary">{formatPrice(order.price)}</span>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {canCancel && (
          <button className="w-full py-3.5 border border-red-200 text-red-500 text-sm font-semibold rounded-2xl hover:bg-red-50 transition-colors bg-white">
            취소 신청
          </button>
        )}
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          className="h-12 text-base"
          onClick={() => router.push("/support")}
        >
          고객센터 문의
        </Button>
      </div>
    </div>
  );
}
