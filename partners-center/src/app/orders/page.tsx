'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, ShoppingCart, ChevronDown } from 'lucide-react';
import { orders, channels, OrderStatus, formatCurrency } from '@/data/mock';
import { clsx } from 'clsx';

const statusLabels: Record<OrderStatus, string> = {
  CREATED: '주문완료',
  PAID: '결제완료',
  CANCEL_REQUESTED: '취소요청',
  CANCELED: '취소완료',
};

const statusColors: Record<OrderStatus, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  CANCEL_REQUESTED: 'bg-yellow-100 text-yellow-700',
  CANCELED: 'bg-gray-100 text-gray-500',
};

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesChannel = channelFilter === 'ALL' || o.channelId === channelFilter;
    const matchesSearch =
      !searchQuery ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerName.includes(searchQuery) ||
      o.productName.includes(searchQuery);
    const matchesDateFrom = !dateFrom || o.createdAt >= dateFrom;
    const matchesDateTo = !dateTo || o.createdAt <= dateTo + ' 23:59:59';
    return matchesStatus && matchesChannel && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExportCSV = () => {
    const headers = ['주문번호', '상품명', '채널', '구매자', '수신자', '금액', '상태', '주문일시'];
    const rows = filtered.map((o) => [
      o.orderNumber,
      o.productName,
      o.channelName,
      o.buyerName,
      o.recipientName,
      o.amount,
      statusLabels[o.status],
      o.createdAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">주문 목록</h2>
          <p className="text-sm text-gray-500 mt-0.5">총 {filtered.length}건의 주문</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={16} />
          CSV 내보내기
        </button>
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
            onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | 'ALL'); handleFilterChange(); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all bg-white text-gray-700"
          >
            <option value="ALL">전체 상태</option>
            <option value="CREATED">주문완료</option>
            <option value="PAID">결제완료</option>
            <option value="CANCEL_REQUESTED">취소요청</option>
            <option value="CANCELED">취소완료</option>
          </select>
          <select
            value={channelFilter}
            onChange={(e) => { setChannelFilter(e.target.value); handleFilterChange(); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all bg-white text-gray-700"
          >
            <option value="ALL">전체 채널</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="주문번호, 구매자, 상품명..."
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
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">주문번호</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">채널</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">구매자</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">수신자</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">금액</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">주문일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <ShoppingCart size={40} className="mb-2 opacity-30" />
                      <p className="text-sm">주문 내역이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-xs font-mono text-[#7634CB] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-900">{order.productName}</span>
                      <span className="text-xs text-gray-400 ml-1">×{order.quantity}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-600">{order.channelName}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-700">{order.buyerName}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="text-sm text-gray-700">{order.recipientName}</span>
                        <div className="text-xs text-gray-400">{order.recipientPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={clsx(
                          'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                          statusColors[order.status]
                        )}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-500">{order.createdAt}</span>
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
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}건
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
