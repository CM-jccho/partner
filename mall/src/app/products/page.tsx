"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { products, categories, type Category } from "@/data/mock";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

type SortOption = "추천순" | "인기순" | "낮은가격순" | "높은가격순" | "최신순";

const sortOptions: SortOption[] = ["추천순", "인기순", "낮은가격순", "높은가격순", "최신순"];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [sortOption, setSortOption] = useState<SortOption>("추천순");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [filterMaxPrice, setFilterMaxPrice] = useState(100000);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (filterDiscount) {
      result = result.filter((p) => p.discount > 0);
    }

    result = result.filter((p) => p.price <= filterMaxPrice);

    switch (sortOption) {
      case "인기순":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "낮은가격순":
        result.sort((a, b) => a.price - b.price);
        break;
      case "높은가격순":
        result.sort((a, b) => b.price - a.price);
        break;
      case "최신순":
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, sortOption, filterDiscount, filterMaxPrice]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Search Bar */}
      <div className="bg-white sticky top-14 z-40 px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="상품권 이름, 브랜드 검색..."
            className="w-full h-10 pl-9 pr-4 bg-gray-100 rounded-full text-sm text-gray-800 outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-2.5 gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
              selectedCategory === null
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1",
                selectedCategory === cat.name
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Filter Row */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          상품 <span className="font-bold text-gray-900">{filteredProducts.length}</span>개
        </p>
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFilter(false);
              }}
              className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              {sortOption}
              <ChevronDown size={14} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-32 overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                      sortOption === option ? "text-primary font-semibold" : "text-gray-700"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => {
              setShowFilter(!showFilter);
              setShowSortMenu(false);
            }}
            className={cn(
              "flex items-center gap-1 text-sm border rounded-lg px-3 py-1.5 transition-colors",
              showFilter || filterDiscount || filterMaxPrice < 100000
                ? "border-primary text-primary bg-primary-50"
                : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            )}
          >
            <SlidersHorizontal size={14} />
            필터
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterDiscount}
                  onChange={(e) => setFilterDiscount(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm font-medium text-gray-700">할인 상품만 보기</span>
              </label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">최대 가격</span>
                <span className="text-sm font-bold text-primary">
                  {filterMaxPrice.toLocaleString()}원
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={5000}
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>5,000원</span>
                <span>100,000원</span>
              </div>
            </div>
            <button
              onClick={() => {
                setFilterDiscount(false);
                setFilterMaxPrice(100000);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              필터 초기화
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-gray-600 font-medium">검색 결과가 없습니다</p>
            <p className="text-gray-400 text-sm mt-1">다른 검색어나 카테고리를 선택해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Overlay for closing dropdowns */}
      {(showSortMenu || showFilter) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSortMenu(false);
          }}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">로딩 중...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
