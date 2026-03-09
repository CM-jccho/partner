'use client';

import { useState } from 'react';
import { Search, Gift, Send } from 'lucide-react';
import { vouchers, VoucherStatus, formatCurrency } from '@/data/mock';
import { clsx } from 'clsx';

const statusLabels: Record<VoucherStatus, string> = {
  ISSUED: '발행됨',
  DELIVERED: '전달됨',
  REDEEMED: '사용완료',
  EXPIRED: '만료됨',
};

const statusColors: Record<VoucherStatus, string> = {
  ISSUED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-purple-100 text-purple-700',
  REDEEMED: 'bg-green-100 text-green-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
};

const ITEMS_PER_PAGE = 10;

export default function VouchersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoucherStatus | 'ALL'>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = vouchers.filter((v) => {
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      v.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.recipientName.includes(searchQuery) ||
      v.productName.includes(searchQuery);
    const matchesDateFrom = !dateFrom || v.issuedAt >= dateFrom;
    const matchesDateTo = !dateTo || v.issuedAt <= dateTo + ' 23:59:59';
    return matchesStatus && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResend = (voucherId: string, recipientName: string) => {
    alert(`${recipientName}님에게 상품권을 재발송합니다.`);
  };

  const handleFilterChange = () => setCurrentPage(1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">상품권 목록</h2>
          <p className="text-sm text-gray-500 mt-0.5">총 {filtered.length}개의 상품권</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['ALL', 'ISSUED', 'DELIVERED', 'REDEEMED', 'EXPIRED'] as const).slice(1).map((status) => {
          const count = vouchers.filter((v) => v.status === status).length;
          return (
            <button
              key={status}
              onClick={() => { setStatusFilter(status as VoucherStatus); handleFilterChange(); }}
              className={clsx(
                'bg-white rounded-xl p-3 border text-left transition-all',
                statusFilter === status
                  ? 'border-[#7634CB] ring-1 ring-[#7634CB]/20'
                  : 'border-gray-100 hover:border-gray-200'
              )}
            >
              <div className="text-xs text-gray-500 mb-1">{statusLabels[status as VoucherStatus]}</div>
              <div className="text-xl font-bold text-gray-900">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); handleFilterChange(); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all text-gray-700"
          />
          <span className="self-center text-gray-400 text-sm">~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); handleFilterChange(); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all text-gray-700"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as VoucherStatus | 'ALL'); handleFilterChange(); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all bg-white text-gray-700"
          >
            <option value="ALL">전체 상태</option>
            <option value="ISSUED">발행됨</option>
            <option value="DELIVERED">전달됨</option>
            <option value="REDEEMED">사용완료</option>
            <option value="EXPIRED">만료됨</option>
          </select>
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="바우처코드, 수신자, 상품명..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">바우처코드</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">수신자</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">발행일</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">만료일</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">액면가</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Gift size={40} className="mb-2 opacity-30" />
                      <p className="text-sm">발행된 상품권이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-gray-500">{voucher.voucherCode}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-900">{voucher.productName}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="text-sm text-gray-700">{voucher.recipientName}</span>
                        <div className="text-xs text-gray-400">{voucher.recipientPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-500">{voucher.issuedAt.split(' ')[0]}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={clsx(
                          'text-xs',
                          new Date(voucher.expiresAt) < new Date() && voucher.status !== 'REDEEMED'
                            ? 'text-red-500 font-medium'
                            : 'text-gray-500'
                        )}
                      >
                        {voucher.expiresAt}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(voucher.faceValue)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                          statusColors[voucher.status]
                        )}
                      >
                        {statusLabels[voucher.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {voucher.status === 'DELIVERED' && (
                        <button
                          onClick={() => handleResend(voucher.id, voucher.recipientName)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#7634CB] bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Send size={12} />
                          재발송
                        </button>
                      )}
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
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                return page <= totalPages ? (
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
                ) : null;
              })}
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
