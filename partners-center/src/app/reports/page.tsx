'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, ShoppingCart, Gift, Percent } from 'lucide-react';
import { monthlySales, channelSales, voucherStatusData, orders, formatCurrency, formatNumber } from '@/data/mock';
import { clsx } from 'clsx';

type Period = 'this_month' | 'last_month' | 'last_3months' | 'last_12months';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'this_month', label: '이번달' },
  { value: 'last_month', label: '지난달' },
  { value: 'last_3months', label: '최근 3개월' },
  { value: 'last_12months', label: '최근 12개월' },
];

const topProducts = [
  { name: '스타벅스 아메리카노', sales: 28500000, count: 5940 },
  { name: '배달의민족 2만원권', sales: 19000000, count: 950 },
  { name: 'CGV 영화 관람권', sales: 13000000, count: 867 },
  { name: '이마트 5만원권', sales: 12000000, count: 240 },
  { name: '올리브영 1만원권', sales: 9500000, count: 950 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('this_month');

  const stats = {
    totalOrders: orders.filter((o) => o.status === 'PAID').length,
    totalSales: orders.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.amount, 0),
    avgOrderAmount: Math.round(
      orders.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.amount, 0) /
        Math.max(orders.filter((o) => o.status === 'PAID').length, 1)
    ),
    voucherUsageRate: 68,
  };

  const chartData = period === 'last_12months' ? monthlySales : monthlySales.slice(-3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">판매 리포트</h2>
          <p className="text-sm text-gray-500 mt-0.5">판매 현황 및 통계를 확인합니다.</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                period === p.value ? 'bg-white text-[#7634CB] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '총 판매건수', value: `${formatNumber(stats.totalOrders)}건`, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '총 매출', value: formatCurrency(stats.totalSales), icon: TrendingUp, color: 'text-[#7634CB]', bg: 'bg-purple-50' },
          { label: '평균 주문금액', value: formatCurrency(stats.avgOrderAmount), icon: Percent, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '상품권 사용률', value: `${stats.voucherUsageRate}%`, icon: Gift, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center mb-3', item.bg)}>
              <item.icon size={18} className={item.color} />
            </div>
            <div className="text-xl font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-5">월별 매출 추이</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '매출']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
            />
            <Line type="monotone" dataKey="sales" stroke="#7634CB" strokeWidth={2.5} dot={{ fill: '#7634CB', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Sales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-5">채널별 매출</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={channelSales} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} width={80} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} />
              <Bar dataKey="sales" fill="#7634CB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Voucher Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-5">상품권 상태 분포</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={voucherStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {voucherStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-5">상품별 매출 TOP 5</h3>
        <div className="space-y-3">
          {topProducts.map((p, idx) => {
            const maxSales = topProducts[0].sales;
            const pct = Math.round((p.sales / maxSales) * 100);
            return (
              <div key={p.name} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-[#7634CB] text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                    <span className="text-sm font-bold text-[#7634CB] ml-2 whitespace-nowrap">{formatCurrency(p.sales)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#7634CB] to-[#9B59B6] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatNumber(p.count)}건</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
