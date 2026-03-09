'use client';

import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Gift,
  Package,
  Layers,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';
import {
  dashboardStats,
  monthlySales,
  channelSales,
  voucherStatusData,
  orders,
  formatCurrency,
  formatNumber,
} from '@/data/mock';
import { clsx } from 'clsx';

const recentOrders = orders.slice(0, 5);

const statusLabels: Record<string, string> = {
  CREATED: '주문완료',
  PAID: '결제완료',
  CANCEL_REQUESTED: '취소요청',
  CANCELED: '취소완료',
};

const statusColors: Record<string, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  CANCEL_REQUESTED: 'bg-yellow-100 text-yellow-700',
  CANCELED: 'bg-gray-100 text-gray-600',
};

const last6MonthsSales = monthlySales.slice(-6);

const formatTooltipValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}백만`;
  return formatNumber(value);
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-gradient-to-br from-[#7634CB] to-[#5A2799] rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-purple-200">이번달 매출</span>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatCurrency(dashboardStats.totalSalesThisMonth)}
          </div>
          <div className="flex items-center gap-1 text-sm text-purple-200">
            <TrendingUp size={14} />
            <span>+{dashboardStats.salesGrowth}% 지난달 대비</span>
          </div>
        </div>

        {/* Issued Vouchers */}
        <div className="bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-200">발행 상품권</span>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Gift size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {formatNumber(dashboardStats.issuedVouchers)}개
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-200">
            <TrendingUp size={14} />
            <span>+{dashboardStats.vouchersGrowth}% 지난달 대비</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">활성 상품</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardStats.activeProducts}개
          </div>
          <div className="text-sm text-gray-500">등록된 활성 상품 수</div>
        </div>

        {/* Channel Count */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">채널 수</span>
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Layers size={20} className="text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardStats.channelCount}개
          </div>
          <div className="text-sm text-gray-500">연동된 판매 채널 수</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">월별 매출 추이</h2>
            <span className="text-xs text-gray-400">최근 6개월</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={last6MonthsSales}>
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
                formatter={(value: number) => [formatCurrency(value), '매출']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#7634CB"
                strokeWidth={2.5}
                dot={{ fill: '#7634CB', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">채널별 매출</h2>
            <span className="text-xs text-gray-400">이번달</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={channelSales} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), '매출']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="sales" fill="#7634CB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Voucher Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">상품권 현황</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={voucherStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {voucherStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, '']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {voucherStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">최근 주문</h2>
            <Link
              href="/orders"
              className="flex items-center gap-1 text-sm text-[#7634CB] hover:text-[#5A2799] transition-colors"
            >
              전체보기
              <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <ShoppingCart size={40} className="mb-2 opacity-30" />
              <p className="text-sm">주문 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">
                        {order.orderNumber}
                      </span>
                      <span
                        className={clsx(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          statusColors[order.status]
                        )}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mt-0.5 truncate">
                      {order.productName}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {order.channelName} · {order.buyerName}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {order.createdAt.split(' ')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-4">빠른 실행</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products/new"
            className="flex items-center gap-2 px-5 py-3 bg-[#7634CB] text-white rounded-xl font-medium text-sm hover:bg-[#5A2799] transition-colors shadow-sm"
          >
            <Package size={18} />
            상품 등록하기
          </Link>
          <Link
            href="/channels"
            className="flex items-center gap-2 px-5 py-3 bg-white text-[#7634CB] rounded-xl font-medium text-sm hover:bg-purple-50 transition-colors border border-[#7634CB]"
          >
            <Layers size={18} />
            채널 연동하기
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ShoppingCart size={18} />
            주문 확인하기
          </Link>
          <Link
            href="/settlement"
            className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <TrendingUp size={18} />
            정산 현황 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
