'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/Modal';
import { settlementData, revenueTrend, SettlementItem } from '@/data/mock';
import { formatKRW, formatDate } from '@/lib/utils';
import { clsx } from 'clsx';

const statusConfig: Record<string, { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  COMPLETED: { label: '완료', variant: 'success' },
  PROCESSING: { label: '처리중', variant: 'info' },
  PENDING: { label: '대기', variant: 'warning' },
  CLOSED: { label: '마감', variant: 'gray' },
};

export default function SettlementPage() {
  const [data, setData] = useState<SettlementItem[]>(settlementData);
  const [closeModal, setCloseModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const totalRevenue = data.reduce((s, d) => s + d.totalRevenue, 0);
  const totalCommission = data.reduce((s, d) => s + d.commissionAmount, 0);
  const totalSettlement = data.reduce((s, d) => s + d.settlementAmount, 0);
  const completedCount = data.filter((d) => d.status === 'COMPLETED').length;

  const chartData = data.slice(0, 10).map((d) => ({
    name: d.partnerName.replace(/\(주\)|\(주\)/, '').slice(0, 6),
    revenue: d.totalRevenue,
    settlement: d.settlementAmount,
  }));

  const handleClose = () => {
    setData((prev) =>
      prev.map((d) =>
        d.status === 'PROCESSING' || d.status === 'PENDING'
          ? { ...d, status: 'COMPLETED' as const, completedDate: new Date().toISOString().slice(0, 10) }
          : d
      )
    );
    setCloseModal(false);
    setSuccessMsg('2026년 2월 정산이 마감되었습니다.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">정산 대시보드</h2>
          <p className="text-sm text-gray-500 mt-0.5">파트너별 정산 현황을 관리합니다. (2026년 2월)</p>
        </div>
        <button
          onClick={() => setCloseModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#004399] text-white rounded-xl text-sm font-medium hover:bg-[#003380] transition-colors shadow-sm"
        >
          <CheckCircle size={16} />
          이번 달 정산 마감
        </button>
      </div>

      {successMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{successMsg}</div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '총 매출', value: formatKRW(totalRevenue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '수수료 수익', value: formatKRW(totalCommission), icon: TrendingUp, color: 'text-[#004399]', bg: 'bg-blue-50' },
          { label: '파트너 정산액', value: formatKRW(totalSettlement), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '정산 완료', value: `${completedCount} / ${data.length}개사`, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-5">파트너별 매출 현황</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              formatter={(v: number, name: string) => [formatKRW(v), name === 'revenue' ? '총매출' : '정산액']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
            />
            <Bar dataKey="revenue" fill="#BFDBFE" radius={[4, 4, 0, 0]} name="revenue" />
            <Bar dataKey="settlement" fill="#004399" radius={[4, 4, 0, 0]} name="settlement" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Settlement Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">파트너별 정산 현황</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['파트너명', '총 매출', '수수료율', '수수료', '정산금액', '정산 상태', '정산예정일', '완료일'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item) => {
                const cfg = statusConfig[item.status] || { label: item.status, variant: 'default' as const };
                return (
                  <tr key={item.partnerId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.partnerName}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{formatKRW(item.totalRevenue)}</td>
                    <td className="px-4 py-3 text-gray-600 text-center">{item.commissionRate}%</td>
                    <td className="px-4 py-3 text-red-500 whitespace-nowrap">-{formatKRW(item.commissionAmount)}</td>
                    <td className="px-4 py-3 font-semibold text-[#004399] whitespace-nowrap">{formatKRW(item.settlementAmount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{item.scheduledDate}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{item.completedDate || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={closeModal}
        onClose={() => setCloseModal(false)}
        onConfirm={handleClose}
        title="정산 마감 처리"
        message="2026년 2월 정산을 마감하시겠습니까? 마감 후에는 수정이 불가합니다."
        confirmLabel="정산 마감"
        confirmVariant="primary"
      />
    </div>
  );
}
