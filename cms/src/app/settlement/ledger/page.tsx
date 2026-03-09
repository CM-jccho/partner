'use client';

import { useState, useMemo } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import Badge, { settlementStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { settlementData, revenueTrend } from '@/data/mock';
import { formatKRW, formatDate } from '@/lib/utils';
import { clsx } from 'clsx';

const MONTHS = ['전체', '2026-02', '2026-01', '2025-12', '2025-11'];

export default function SettlementLedgerPage() {
  const [monthFilter, setMonthFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return settlementData.filter((s) => {
      const matchMonth = monthFilter === '전체' || s.month === monthFilter;
      const matchStatus = statusFilter === '' || s.status === statusFilter;
      const matchSearch = search === '' || s.partnerName.includes(search);
      return matchMonth && matchStatus && matchSearch;
    });
  }, [monthFilter, statusFilter, search]);

  const totals = useMemo(() => ({
    revenue: filtered.reduce((acc, s) => acc + s.totalRevenue, 0),
    commission: filtered.reduce((acc, s) => acc + s.commissionAmount, 0),
    settlement: filtered.reduce((acc, s) => acc + s.settlementAmount, 0),
  }), [filtered]);

  // Monthly summary from revenueTrend
  const monthlySummary = revenueTrend.slice(-6).reverse();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">정산 원장</h2>
          <p className="text-sm text-gray-500 mt-0.5">파트너별 월별 정산 내역 전체 기록</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={14} />
          엑셀 다운로드
        </Button>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#004399]" />
          <h3 className="font-semibold text-gray-800">월별 정산 요약 (최근 6개월)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['정산월', '총 매출', '수수료 수익', '파트너 정산액', '전월 대비'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monthlySummary.map((m, i) => {
                const prev = monthlySummary[i + 1];
                const diff = prev ? ((m.revenue - prev.revenue) / prev.revenue) * 100 : null;
                return (
                  <tr key={m.month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{m.month}</td>
                    <td className="px-4 py-3 text-gray-900">{formatKRW(m.revenue)}</td>
                    <td className="px-4 py-3 text-[#004399] font-medium">{formatKRW(m.commission)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatKRW(m.revenue - m.commission)}</td>
                    <td className="px-4 py-3">
                      {diff !== null ? (
                        <span className={clsx('text-xs font-medium', diff >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="파트너명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-40 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            <option value="">전체 상태</option>
            <option value="COMPLETED">완료</option>
            <option value="PROCESSING">처리중</option>
            <option value="PENDING">대기</option>
            <option value="CLOSED">마감</option>
          </select>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">파트너별 정산 원장</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['정산월', '파트너', '총 매출', '수수료율', '수수료', '정산금액', '상태', '예정일', '완료일'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => {
                const badge = settlementStatusBadge(s.status);
                return (
                  <tr key={`${s.partnerId}-${s.month}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 font-medium">{s.month}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.partnerName}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{formatKRW(s.totalRevenue)}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{s.commissionRate}%</td>
                    <td className="px-4 py-3 text-red-500 whitespace-nowrap">-{formatKRW(s.commissionAmount)}</td>
                    <td className="px-4 py-3 font-semibold text-[#004399] whitespace-nowrap">{formatKRW(s.settlementAmount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{s.scheduledDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{s.completedDate ?? '-'}</td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-700">합계 ({filtered.length}건)</td>
                <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{formatKRW(totals.revenue)}</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 font-bold text-red-500 whitespace-nowrap">-{formatKRW(totals.commission)}</td>
                <td className="px-4 py-3 font-bold text-[#004399] whitespace-nowrap">{formatKRW(totals.settlement)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
