"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Share2, MapPin, Clock, Star } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/mock";
import { formatPrice, formatDate } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type TabKey = "상품설명" | "사용처" | "유효기간" | "리뷰";
const tabs: TabKey[] = ["상품설명", "사용처", "유효기간", "리뷰"];

const sampleReviews = [
  {
    id: "r1",
    userName: "김**",
    rating: 5,
    date: "2024-02-28",
    text: "선물로 줬는데 상대방이 너무 좋아했어요. 배송도 빠르고 할인도 되서 완전 만족합니다!",
  },
  {
    id: "r2",
    userName: "박**",
    rating: 4,
    date: "2024-02-20",
    text: "가격 대비 퀄리티가 좋아요. 친구 생일 선물로 구매했는데 잘 쓰고 있다고 하네요.",
  },
  {
    id: "r3",
    userName: "이**",
    rating: 5,
    date: "2024-02-15",
    text: "항상 여기서 구매해요. 신속하게 발송되고 사용도 간편해서 최고입니다.",
  },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("상품설명");

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
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

  const discountedRating = product.rating;

  return (
    <div className="bg-white min-h-screen">
      {/* Custom Header */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 h-12 flex items-center px-4">
        <button
          onClick={() => router.back()}
          className="text-gray-700 hover:text-primary transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-gray-900 truncate px-4">
          {product.brand}
        </span>
        <button className="text-gray-700 hover:text-primary transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      <div className="pt-12">
        {/* Product Image */}
        <div className="relative w-full h-56">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="430px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Product Info */}
        <div className="px-4 py-4">
          <span className="inline-block bg-primary-50 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
            {product.brand}
          </span>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={discountedRating} size={14} />
            <span className="text-sm text-yellow-500 font-semibold">{discountedRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">리뷰 {product.reviewCount.toLocaleString()}개</span>
          </div>

          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-end gap-2">
              {product.discount > 0 && (
                <span className="text-base font-semibold text-primary">
                  {product.discount}%
                </span>
              )}
              <span className="text-2xl font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.discount > 0 && (
              <p className="text-sm text-gray-400 line-through mt-0.5">
                정가 {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-xs text-green-600 font-medium mt-1">
              {product.discount > 0 &&
                `${formatPrice(product.originalPrice - product.price)} 절약`}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-2 bg-gray-50" />

        {/* Tabs */}
        <div className="sticky top-[104px] bg-white z-20 border-b border-gray-100">
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

        {/* Tab Content */}
        <div className="px-4 py-4 pb-24">
          {activeTab === "상품설명" && (
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              <div className="mt-4 space-y-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block mr-2 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "사용처" && (
            <div className="space-y-3">
              {product.usageInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{info}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "유효기간" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl">
                <Clock size={20} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">유효기간</p>
                  <p className="text-sm text-gray-600">구매일로부터 {product.expiryDays}일</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 mb-2">유효기간 안내</p>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  <li>• 유효기간 만료 후 사용 불가합니다</li>
                  <li>• 유효기간 30일 전 SMS 알림을 드립니다</li>
                  <li>• 유효기간 연장은 고객센터로 문의하세요</li>
                  <li>• 유효기간 만료 후 환불 불가합니다</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "리뷰" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-900">{product.rating.toFixed(1)}</p>
                  <StarRating rating={product.rating} size={14} className="justify-center mt-1" />
                  <p className="text-xs text-gray-400 mt-1">{product.reviewCount.toLocaleString()}개 리뷰</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <Star size={10} className="text-yellow-400" fill="currentColor" />
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{
                            width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {sampleReviews.map((review) => (
                  <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {review.userName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{review.userName}</p>
                        <p className="text-[10px] text-gray-400">{formatDate(review.date)}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={review.rating} size={11} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push(`/purchase/${product.id}`)}
          className="h-12 text-base"
        >
          구매하기 {formatPrice(product.price)}
        </Button>
      </div>
    </div>
  );
}
