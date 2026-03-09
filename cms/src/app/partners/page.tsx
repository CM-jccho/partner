'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, CheckCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge, { partnerStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { partners, Partner, PartnerStatus } from '@/data/mock';
import { formatKRW, formatDate } from '@/lib/utils';

const CATEGORIES = ['전체', '카페/음료', '외식/맛집', '편의점/마트', '쇼핑', '영화/문화'];
const STATUSES: { label: string; value: string }[] = [
  { label: '전체', value: '' },
  { label: '활성', value: 'ACTIVE' },
  { label: '승인대기', value: 'PENDING' },
  { label: '정지', value: 'SUSPENDED' },
  { label: '거절', value: 'REJECTED' },
];

export default function PartnersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [page, setPage] = useState(1);
  const [partnerList, setPartnerList] = useState<Partner[]>(partners);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'suspend' | 'activate';
    partner: Partner | null;
  }>({ isOpen: false, action: 'suspend', partner: null });
  const [successMessage, setSuccessMessage] = useState('');

  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    return partnerList.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.includes(search) ||
        p.businessNumber.includes(search) ||
        p.ceoName.includes(search);
      const matchStatus = statusFilter === '' || p.status === statusFilter;
      const matchCategory = categoryFilter === '전체' || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [partnerList, search, statusFilter, categoryFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const stats = {
    total: partnerList.length,
    active: partnerList.filter((p) => p.status === 'ACTIVE').length,
    pending: partnerList.filter((p) => p.status === 'PENDING').length,
    suspended: partnerList.filter((p) => p.status === 'SUSPENDED').length,
    rejected: partnerList.filter((p) => p.status === 'REJECTED').length,
  };

  const handleAction = () => {
    if (!confirmModal.partner) return;
    const newStatus: PartnerStatus =
      confirmModal.action === 'suspend' ? 'SUSPENDED' : 'ACTIVE';
    setPartnerList((prev) =>
      prev.map((p) =>
        p.id === confirmModal.partner!.id ? { ...p, status: newStatus } : p
      )
    );
    setSuccessMessage(
      confirmModal.action === 'suspend'
        ? `${confirmModal.partner.name}이(가) 정지되었습니다.`
        : `${confirmModal.partner.name}이(가) 활성화되었습니다.`
    );
    setConfirmModal({ isOpen: false, action: 'suspend', partner: null });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const columns: Column<Partner>[] = [
    {
      key: 'name',
      header: '파트너명',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.businessNumber}</p>
        </div>
      ),
    },
    { key: 'ceoName', header: '대표자' },
    { key: 'category', header: '카테고리' },
    {
      key: 'totalProducts',
      header: '상품수',
      render: (row) => <span>{row.totalProducts}개</span>,
    },
    {
      key: 'monthlyRevenue',
      header: '이번달 매출',
      render: (row) => (
        <span className="font-medium">{row.monthlyRevenue > 0 ? formatKRW(row.monthlyRevenue) : '-'}</span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => {
        const badge = partnerStatusBadge(row.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    {
      key: 'appliedAt',
      header: '가입일',
      render: (row) => <span>{formatDate(row.appliedAt)}</span>,
    },
    {
      key: 'actions',
      header: '액션',
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push(`/partners/${row.id}`)}
          >
            상세
          </Button>
          {row.status === 'ACTIVE' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setConfirmModal({ isOpen: true, action: 'suspend', partner: row })}
            >
              정지
            </Button>
          )}
          {row.status === 'SUSPENDED' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => setConfirmModal({ isOpen: true, action: 'activate', partner: row })}
            >
              해제
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: '전체', value: stats.total, color: 'text-gray-900' },
          { label: '활성', value: stats.active, color: 'text-emerald-600' },
          { label: '대기', value: stats.pending, color: 'text-amber-600' },
          { label: '정지', value: stats.suspended, color: 'text-red-600' },
          { label: '거절', value: stats.rejected, color: 'text-gray-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="파트너명, 사업자번호, 대표자 검색..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/partners/${row.id}`)}
        emptyMessage="검색 결과가 없습니다."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: 'suspend', partner: null })}
        onConfirm={handleAction}
        title={confirmModal.action === 'suspend' ? '파트너 정지' : '파트너 활성화'}
        message={
          confirmModal.action === 'suspend'
            ? `${confirmModal.partner?.name}을(를) 정지하시겠습니까? 정지 시 모든 서비스가 중단됩니다.`
            : `${confirmModal.partner?.name}을(를) 활성화하시겠습니까?`
        }
        confirmLabel={confirmModal.action === 'suspend' ? '정지' : '활성화'}
        confirmVariant={confirmModal.action === 'suspend' ? 'danger' : 'success'}
      />
    </div>
  );
}
