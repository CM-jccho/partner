'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, Edit, Layers, EyeOff } from 'lucide-react';
import { products, ProductStatus, formatCurrency, formatNumber } from '@/data/mock';
import { clsx } from 'clsx';

const statusLabels: Record<ProductStatus, string> = {
  DRAFT: '임시저장',
  PENDING: '승인대기',
  APPROVED: '승인됨',
  ACTIVE: '판매중',
  INACTIVE: '비활성',
};

const statusColors: Record<ProductStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  ACTIVE: 'bg-blue-100 text-blue-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
};

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = products.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((p) => p.id)));
    }
  };

  const handleFilterChange = (status: ProductStatus | 'ALL') => {
    setStatusFilter(status);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">상품 목록</h2>
          <p className="text-sm text-gray-500 mt-0.5">총 {filtered.length}개의 상품</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors shadow-sm"
        >
          <Plus size={18} />
          상품 등록
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="상품명, 브랜드 검색..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value as ProductStatus | 'ALL')}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all bg-white text-gray-700"
          >
            <option value="ALL">전체 상태</option>
            <option value="DRAFT">임시저장</option>
            <option value="PENDING">승인대기</option>
            <option value="APPROVED">승인됨</option>
            <option value="ACTIVE">판매중</option>
            <option value="INACTIVE">비활성</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-[#7634CB]/5 border border-[#7634CB]/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-[#7634CB] font-medium">
            {selectedIds.size}개 선택됨
          </span>
          <div className="flex gap-2">
            <button className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              일괄 활성화
            </button>
            <button className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
              일괄 비활성화
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3.5 text-left">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.size === paginated.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#7634CB] focus:ring-[#7634CB]"
                  />
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">브랜드</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">판매가</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">재고</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">등록일</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Package size={40} className="mb-2 opacity-30" />
                      <p className="text-sm">등록된 상품이 없습니다.</p>
                      <Link
                        href="/products/new"
                        className="mt-3 text-sm text-[#7634CB] hover:underline"
                      >
                        상품 등록하기
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product.id}
                    className={clsx(
                      'hover:bg-gray-50/50 transition-colors',
                      selectedIds.has(product.id) && 'bg-purple-50/30'
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-gray-300 text-[#7634CB] focus:ring-[#7634CB]"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-600">{product.brand}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={clsx(
                          'text-sm font-medium',
                          product.stock < 50 ? 'text-red-600' : 'text-gray-900'
                        )}
                      >
                        {formatNumber(product.stock)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                          statusColors[product.status]
                        )}
                      >
                        {statusLabels[product.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-500">{product.createdAt}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-[#7634CB] hover:bg-purple-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit size={15} />
                        </Link>
                        <Link
                          href={`/channels`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="채널설정"
                        >
                          <Layers size={15} />
                        </Link>
                        <button
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="비활성화"
                        >
                          <EyeOff size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}개
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'px-3 py-1.5 text-sm border rounded-lg transition-colors',
                    page === currentPage
                      ? 'bg-[#7634CB] text-white border-[#7634CB]'
                      : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
