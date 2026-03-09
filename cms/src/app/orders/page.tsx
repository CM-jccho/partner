'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge, { orderStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { orders, Order } from '@/data/mock';
import { formatKRW, formatDateTime } from '@/lib/utils';

const CHANNELS = ['전체', 'KAKAO', 'NAVER', 'DIRECT'];
const STATUSES = [
  { label: '전체', value: '' },
  { label: '완료', value: 'COMPLETED' },
  { label: '처리중', value: 'PROCESSING' },
  { label: '대기중', value: 'PENDING' },
  { label: '취소', value: 'CANCELED' },
  { label: '환불', value: 'REFUNDED' },
];

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('전체');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const partnerOptions = useMemo(() => {
    return [...new Set(orders.map((o) => o.partnerName))];
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        search === '' ||
        o.orderNumber.includes(search) ||
        o.buyerName.includes(search) ||
        o.productName.includes(search);
      const matchStatus = statusFilter === '' || o.status === statusFilter;
      const matchChannel = channelFilter === '전체' || o.channel === channelFilter;
      const matchPartner = partnerFilter === '' || o.partnerName === partnerFilter;
      return matchSearch && matchStatus && matchChannel && matchPartner;
    });
  }, [search, statusFilter, channelFilter, partnerFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: '주문번호',
      render: (row) => (
        <span className="font-mono text-xs text-[#004399] font-medium">{row.orderNumber}</span>
      ),
    },
    { key: 'partnerName', header: '파트너' },
    {
      key: 'productName',
      header: '상품명',
      render: (row) => (
        <span className="max-w-40 truncate block">{row.productName}</span>
      ),
    },
    {
      key: 'buyerName',
      header: '구매자',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900">{row.buyerName}</p>
          <p className="text-xs text-gray-500">{row.buyerPhone}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: '금액',
      render: (row) => (
        <span className="font-medium">{formatKRW(row.amount * row.quantity)}</span>
      ),
    },
    {
      key: 'channel',
      header: '채널',
      render: (row) => {
        const colors: Record<string, string> = {
          KAKAO: 'bg-yellow-100 text-yellow-700',
          NAVER: 'bg-green-100 text-green-700',
          DIRECT: 'bg-blue-100 text-blue-700',
        };
        return (
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${colors[row.channel] || 'bg-gray-100 text-gray-600'}`}>
            {row.channel}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => {
        const badge = orderStatusBadge(row.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    {
      key: 'orderedAt',
      header: '주문일시',
      render: (row) => (
        <span className="text-xs text-gray-500">{formatDateTime(row.orderedAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '액션',
      render: (row) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => { e.stopPropagation(); router.push(`/orders/${row.id}`); }}
        >
          상세
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: '전체', value: orders.length, color: 'text-gray-900' },
          { label: '완료', value: orders.filter((o) => o.status === 'COMPLETED').length, color: 'text-emerald-600' },
          { label: '처리중', value: orders.filter((o) => o.status === 'PROCESSING').length, color: 'text-blue-600' },
          { label: '취소', value: orders.filter((o) => o.status === 'CANCELED').length, color: 'text-red-600' },
          { label: '환불', value: orders.filter((o) => o.status === 'REFUNDED').length, color: 'text-gray-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="주문번호, 구매자명, 상품명 검색..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
          <select
            value={partnerFilter}
            onChange={(e) => { setPartnerFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            <option value="">전체 파트너</option>
            {partnerOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={channelFilter}
            onChange={(e) => { setChannelFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <Button variant="secondary" size="sm">
            <Download size={14} />
            내보내기
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/orders/${row.id}`)}
        emptyMessage="검색 결과가 없습니다."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
