"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products, categories, banners } from "@/data/mock";
import ProductCard from "@/components/ui/ProductCard";

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextBanner, 3000);
    return () => clearInterval(timer);
  }, [nextBanner]);

  const recommendedProducts = products.slice(0, 4);
  const popularProducts = products.slice(4, 9);

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero Banner Carousel */}
      <div className="relative overflow-hidden h-48">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: index === currentBanner ? 1 : 0,
              background: `linear-gradient(135deg, ${banner.gradientFrom}, ${banner.gradientTo})`,
            }}
          >
            <div className="flex flex-col justify-center h-full px-6 pt-2">
              <p className="text-white/80 text-sm font-medium mb-1">{banner.subtitle}</p>
              <h2 className="text-white text-2xl font-black leading-tight">{banner.title}</h2>
              <Link
                href={banner.link}
                className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full w-fit hover:bg-white/30 transition-colors"
              >
                지금 보러가기
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className="transition-all duration-300"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  index === currentBanner
                    ? "w-5 h-2 bg-white"
                    : "w-2 h-2 bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Banner counter */}
        <div className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full">
          {currentBanner + 1} / {banners.length}
        </div>
      </div>

      {/* Category Scroll */}
      <div className="bg-white py-4 mt-2">
        <div className="flex overflow-x-auto no-scrollbar px-4 gap-1">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-primary-50 transition-colors group"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap group-hover:text-primary">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-2 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">추천 상품</h2>
          <Link
            href="/products"
            className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-primary transition-colors"
          >
            전체보기
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Popular Products (horizontal scroll) */}
      <div className="mt-2 bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">인기 상품</h2>
          <Link
            href="/products"
            className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-primary transition-colors"
          >
            전체보기
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} horizontal />
          ))}
        </div>
      </div>

      {/* Event Banner */}
      <div className="mt-2 mb-4 mx-4">
        <Link href="/products">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#7B2FBE] to-[#E91E8C] p-5 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium">한정 이벤트</p>
              <h3 className="text-white text-lg font-black mt-0.5 leading-tight">
                선물하면 포인트 2배!
              </h3>
              <p className="text-white/70 text-xs mt-1">3월 한 달간 진행되는 특별 이벤트</p>
            </div>
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎁</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
