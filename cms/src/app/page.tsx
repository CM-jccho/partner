'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Building2, Package, AlertTriangle, ShoppingCart,
  TrendingUp, DollarSign, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Badge, { partnerStatusBadge, logLevelBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import {
  platformStats, revenueTrend, dailyOrders, categoryDistribution,
  partners, products, systemLogs,
} from '@/data/mock';
import { formatKRW, formatDate } from '@/lib/utils';

const CHART_COLORS = ['#004399', '#0066CC', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

export default function DashboardPage() {
  const [pendingPartners, setPendingPartners] = useState(
    partners.filter((p) => p.status === 'PENDING').slice(0, 3)
  );
  const [pendingProducts, setPendingProducts] = useState(
    products.filter((p) => p.status === 'PENDING').slice(0, 3)
  );
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    targetType: 'partner' | 'product';
    targetId: string;
    targetName: string;
  }>({ isOpen: false, type: 'approve', targetType: 'partner', targetId: '', targetName: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const recentAlerts = systemLogs
    .filter((log) => log.level === 'ERROR' || log.level === 'WARNING')
    .slice(0, 3);

  const handleAction = () => {
    const { type, targetType, targetId } = confirmModal;
    if (targetType === 'partner') {
      setPendingPartners((prev) => prev.filter((p) => p.id !== targetId));
    } else {
      setPendingProducts((prev) => prev.filter((p) => p.id !== targetId));
    }
    setSuccessMessage(
      type === 'approve'
        ? `${confirmModal.targetName}이(가) 승인되었습니다.`
        : `${confirmModal.targetName}이(가) 거절되었습니다.`
    );
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const openConfirm = (
    type: 'approve' | 'reject',
    targetType: 'partner' | 'product',
    targetId: string,
    targetName: string
  ) => {
    setConfirmModal({ isOpen: true, type, targetType, targetId, targetName });
  };

  const revenueData = revenueTrend.map((d) => ({
    month: d.month.slice(5),
    매출: Math.round(d.revenue / 100000000),
    수수료: Math.round(d.commission / 10000000),
  }));

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="파트너 수"
          value={platformStats.totalPartners.toLocaleString('ko-KR')}
          subValue={`활성 ${platformStats.activePartners}개 · 대기 ${platformStats.pendingPartners}개`}
          icon={<Building2 size={20} />}
          color="blue"
        />
        <StatCard
          label="총 상품 수"
          value={platformStats.totalProducts.toLocaleString('ko-KR')}
          subValue={`활성 ${platformStats.activeProducts.toLocaleString('ko-KR')}개`}
          icon={<Package size={20} />}
          color="purple"
        />
        <StatCard
          label="승인 대기"
          value={`${platformStats.pendingApproval + platformStats.pendingPartners}건`}
          subValue={`상품 ${platformStats.pendingApproval}개 · 파트너 ${platformStats.pendingPartners}개`}
          icon={<AlertTriangle size={20} />}
          color="red"
        />
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="오늘 주문"
          value={`${platformStats.todayOrders.toLocaleString('ko-KR')}건`}
          subValue={`어제 ${platformStats.yesterdayOrders}건`}
          change={Math.round(((platformStats.todayOrders - platformStats.yesterdayOrders) / platformStats.yesterdayOrders) * 100)}
          changeLabel="vs 어제"
          icon={<ShoppingCart size={20} />}
          color="green"
        />
        <StatCard
          label="이번달 매출"
          value={formatKRW(platformStats.platformRevenue)}
          subValue={`누적 주문 ${platformStats.totalOrders.toLocaleString('ko-KR')}건`}
          icon={<TrendingUp size={20} />}
          color="blue"
        />
        <StatCard
          label="수수료 수익"
          value={formatKRW(platformStats.commissionRevenue)}
          subValue="이번달 기준"
          icon={<DollarSign size={20} />}
          color="gold"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">플랫폼 매출 추이 (12개월)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004399" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#004399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} unit="억" />
              <Tooltip
                formatter={(value: number) => [`${value}억원`, '매출']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Area
                type="monotone"
                dataKey="매출"
                stroke="#004399"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">파트너 카테고리 분포</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '비율']} contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {categoryDistribution.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CHART_COLORS[idx] }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Orders Bar Chart */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">일별 주문량 (최근 7일)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailyOrders}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip
              formatter={(value: number) => [`${value}건`, '주문']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="orders" fill="#004399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row: Pending Approvals + System Alerts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Pending Partners */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">승인 대기 파트너</h3>
            <Link href="/partners/pending" className="text-xs text-[#004399] hover:underline">
              전체보기
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingPartners.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">대기중인 파트너가 없습니다.</p>
            ) : (
              pendingPartners.map((partner) => {
                const badge = partnerStatusBadge(partner.status);
                return (
                  <div key={partner.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(partner.appliedAt)} 신청</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => openConfirm('approve', 'partner', partner.id, partner.name)}
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openConfirm('reject', 'partner', partner.id, partner.name)}
                      >
                        거절
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">승인 대기 상품</h3>
            <Link href="/products/pending" className="text-xs text-[#004399] hover:underline">
              전체보기
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingProducts.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">대기중인 상품이 없습니다.</p>
            ) : (
              pendingProducts.map((product) => (
                <div key={product.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.partnerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => openConfirm('approve', 'product', product.id, product.name)}
                    >
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openConfirm('reject', 'product', product.id, product.name)}
                    >
                      반려
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">최근 시스템 알림</h3>
          <Link href="/system/logs" className="text-xs text-[#004399] hover:underline">
            전체보기
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentAlerts.map((log) => {
            const levelBadge = logLevelBadge(log.level);
            return (
              <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                {log.level === 'ERROR' ? (
                  <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant={levelBadge.variant}>{levelBadge.label}</Badge>
                    <span className="text-xs text-gray-400">{log.service}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleAction}
        title={confirmModal.type === 'approve' ? '승인 확인' : '거절 확인'}
        message={
          confirmModal.type === 'approve'
            ? `${confirmModal.targetName}을(를) 승인하시겠습니까?`
            : `${confirmModal.targetName}을(를) 거절하시겠습니까?`
        }
        confirmLabel={confirmModal.type === 'approve' ? '승인' : '거절'}
        confirmVariant={confirmModal.type === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
}
