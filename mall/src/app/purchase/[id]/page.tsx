"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, MessageCircle } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const messageTemplates = ["생일 축하해!", "감사합니다!", "수고했어!"];

export default function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [useKakao, setUseKakao] = useState(true);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <span className="text-4xl mb-4">😅</span>
        <p className="text-gray-600 font-medium">상품을 찾을 수 없습니다</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary text-sm font-medium hover:underline"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const totalDiscount = (product.originalPrice - product.price) * quantity;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    let formatted = raw;
    if (raw.length >= 4 && raw.length < 8) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length >= 8) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setRecipientPhone(formatted);
  };

  const handleSubmit = () => {
    router.push(`/purchase/${id}/payment?name=${encodeURIComponent(recipientName)}&qty=${quantity}&total=${totalPrice}`);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-12 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-700">
          <ChevronLeft size={22} />
        </button>
        <span className="text-base font-bold text-gray-900">선물하기</span>
      </div>

      {/* Stepper */}
      <div className="bg-white px-4 py-3 flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
            1
          </div>
          <span className="text-sm font-semibold text-primary">수신자정보</span>
        </div>
        <div className="h-px flex-1 bg-gray-200" />
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center">
            2
          </div>
          <span className="text-sm font-medium text-gray-400">결제</span>
        </div>
      </div>

      <div className="px-4 space-y-3 mt-2 pb-28">
        {/* Product Summary */}
        <div className="bg-white rounded-2xl p-4 flex gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-tight">{product.name}</p>
            <p className="text-base font-bold text-primary mt-1">{formatPrice(product.price)}</p>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">수신자 정보</h3>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">이름</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="받는 분 이름을 입력하세요"
              className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">휴대폰 번호</label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">카카오톡으로 받기</span>
            </div>
            <button
              onClick={() => setUseKakao(!useKakao)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-200",
                useKakao ? "bg-primary" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                  useKakao ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-900">메시지 입력</h3>
          <div className="flex gap-2">
            {messageTemplates.map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setMessage(tmpl)}
                className={cn(
                  "flex-1 py-2 text-xs rounded-lg border font-medium transition-colors",
                  message === tmpl
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                )}
              >
                {tmpl}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="선물 메시지를 입력하세요"
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
          />
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">수량 선택</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">수량</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-base font-bold text-gray-900 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl p-4 space-y-2.5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">결제 금액</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">상품금액</span>
            <span className="text-gray-900">{formatPrice(product.originalPrice * quantity)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">할인금액</span>
              <span className="text-green-600 font-medium">-{formatPrice(totalDiscount)}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-2.5 flex justify-between">
            <span className="text-sm font-bold text-gray-900">최종결제금액</span>
            <span className="text-base font-black text-primary">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={!recipientName || !recipientPhone}
          className="h-12 text-base"
        >
          결제하기
        </Button>
      </div>
    </div>
  );
}
