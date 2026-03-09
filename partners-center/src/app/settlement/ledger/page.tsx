'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { orders, settlementData, formatCurrency, formatNumber } from '@/data/mock';
import { clsx } from 'clsx';

const MONTHS = settlementData.map((s) => s.month);

const statusLabel: Record<string, string> = {
  PAID: '결제완료',
  CREATED: '주문생성',
  CANCEL_REQUESTED: '취소요청',
  CANCELED: '취소됨',
};

const statusColor: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  CREATED: 'bg-blue-100 text-blue-700',
  CANCEL_REQUESTED: 'bg-yellow-100 text-yellow-700',
  CANCELED: 'bg-gray-100 text-gray-500',
};

const COMMISSION_RATE = 0.05;

export default function SettlementLedgerPage() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[MONTHS.length - 1]);

  const monthStat = settlementData.find((s) => s.month === selectedMonth);

  // 선택된 월의 주문만 필터링 (orderId prefix 기반)
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return ym === selectedMonth;
  });

  const totalSales = monthOrders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.amount, 0);
  const totalCommission = Math.round(totalSales * COMMISSION_RATE);
  const totalSettlement = totalSales - totalCommission;

  const formatMonthLabel = (m: string) => {
    const [y, mo] = m.split('-');
    return `${y}년 ${Number(mo)}월`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">정산 원장</h2>
          <p className="text-sm text-gray-500 mt-0.5">월별 상세 정산 내역을 확인합니다.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={16} />
          엑셀 다운로드
        </button>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3">
          <FileSpreadsheet size={18} className="text-[#7634CB]" />
          <span className="font-semibold text-gray-700">정산 월 선택</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none"
          >
            {[...MONTHS].reverse().map((m) => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: '총 매출', value: formatCurrency(monthStat?.totalSales || totalSales), color: 'text-gray-900' },
          { label: '수수료 (5%)', value: formatCurrency(monthStat?.commission || totalCommission), color: 'text-red-600' },
          { label: '정산금액', value: formatCurrency(monthStat?.settlementAmount || totalSettlement), color: 'text-[#7634CB]' },
          { label: '발행 상품권', value: `${formatNumber(monthStat?.totalVouchers || monthOrders.length)}건`, color: 'text-blue-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className={clsx('text-lg font-bold', item.color)}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Status Badge */}
      {monthStat && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">정산 상태:</span>
          <span className={clsx(
            'text-xs font-semibold px-2.5 py-1 rounded-full',
            monthStat.status === 'SETTLED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          )}>
            {monthStat.status === 'SETTLED' ? '정산 완료' : '정산 대기'}
          </span>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">거래 내역</h3>
          <p className="text-xs text-gray-400 mt-0.5">총 {monthOrders.length}건</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['주문번호', '상품명', '채널', '구매자', '금액', '수수료(5%)', '정산금액', '상태', '주문일시'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monthOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                    해당 월의 거래 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                monthOrders.map((order) => {
                  const commission = Math.round(order.amount * COMMISSION_RATE);
                  const settlement = order.amount - commission;
                  const isPaid = order.status === 'PAID';
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-900 max-w-[160px] truncate">{order.productName}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.channelName}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.buyerName}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{formatCurrency(order.amount)}</td>
                      <td className="px-4 py-3 text-red-500 whitespace-nowrap">{isPaid ? `-${formatCurrency(commission)}` : '-'}</td>
                      <td className="px-4 py-3 font-semibold text-[#7634CB] whitespace-nowrap">{isPaid ? formatCurrency(settlement) : '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', statusColor[order.status] || 'bg-gray-100 text-gray-500')}>
                          {statusLabel[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{order.createdAt.slice(0, 16)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {monthOrders.length > 0 && (
              <tfoot>
                <tr className="bg-purple-50">
                  <td colSpan={4} className="px-4 py-3 text-sm font-bold text-gray-700">합계</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">
                    {formatCurrency(monthOrders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.amount, 0))}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-red-500">
                    -{formatCurrency(Math.round(monthOrders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.amount, 0) * COMMISSION_RATE))}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#7634CB]">
                    {formatCurrency(Math.round(monthOrders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.amount, 0) * 0.95))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
