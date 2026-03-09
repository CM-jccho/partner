'use client';

import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ArrowRight, TrendingUp, Calendar } from 'lucide-react';
import { settlementData, formatCurrency, formatNumber } from '@/data/mock';
import { clsx } from 'clsx';

const currentMonth = settlementData[settlementData.length - 1];

const settlementDateNext = '2026-03-15';

export default function SettlementPage() {
  const chartData = settlementData.map((s) => ({
    month: s.month.slice(5), // MM
    amount: s.settlementAmount,
    status: s.status,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">정산 대시보드</h2>
          <p className="text-sm text-gray-500 mt-0.5">정산 현황 및 내역을 확인합니다.</p>
        </div>
        <Link
          href="/settlement/ledger"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          정산 원장 보기
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* This Month Summary */}
      <div className="bg-gradient-to-br from-[#7634CB] to-[#5A2799] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-purple-200">이번달 정산 현황</p>
            <p className="text-xs text-purple-300 mt-0.5">{currentMonth.month}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 text-xs font-medium px-3 py-1.5 rounded-full">
            <Calendar size={12} />
            정산 예정: {settlementDateNext}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-purple-200 mb-1">총 매출</p>
            <p className="text-lg font-bold">{(currentMonth.totalSales / 1000000).toFixed(1)}백만원</p>
          </div>
          <div>
            <p className="text-xs text-purple-200 mb-1">발행 수량</p>
            <p className="text-lg font-bold">{formatNumber(currentMonth.totalVouchers)}개</p>
          </div>
          <div>
            <p className="text-xs text-purple-200 mb-1">수수료 (5%)</p>
            <p className="text-lg font-bold text-red-300">-{(currentMonth.commission / 1000000).toFixed(1)}백만원</p>
          </div>
          <div>
            <p className="text-xs text-purple-200 mb-1">정산 예정액</p>
            <p className="text-lg font-bold text-green-300">{(currentMonth.settlementAmount / 1000000).toFixed(1)}백만원</p>
          </div>
        </div>
      </div>

      {/* Settlement Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-5">월별 정산 내역 (최근 12개월)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '정산액']}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.status === 'SETTLED' ? '#7634CB' : '#F59E0B'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#7634CB]" />
            <span className="text-xs text-gray-500">정산완료</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#F59E0B]" />
            <span className="text-xs text-gray-500">정산예정</span>
          </div>
        </div>
      </div>

      {/* Settlement Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">정산 현황</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">정산월</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">총 매출</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">발행 수량</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">수수료</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">정산금액</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...settlementData].reverse().map((s) => (
                <tr key={s.month} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-gray-900">{s.month}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm text-gray-700">{formatCurrency(s.totalSales)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm text-gray-700">{formatNumber(s.totalVouchers)}개</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm text-red-500">{formatCurrency(s.commission)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(s.settlementAmount)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={clsx(
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                        s.status === 'SETTLED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      {s.status === 'SETTLED' ? '정산완료' : '정산예정'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
