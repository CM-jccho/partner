'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge, { productStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { products, Product, ProductStatus, partners } from '@/data/mock';
import { formatDate } from '@/lib/utils';

const CATEGORIES = ['전체', '카페/음료', '외식/맛집', '편의점/마트', '쇼핑', '영화/문화'];
const STATUSES = [
  { label: '전체', value: '' },
  { label: '활성', value: 'ACTIVE' },
  { label: '승인대기', value: 'PENDING' },
  { label: '비활성', value: 'INACTIVE' },
  { label: '반려', value: 'REJECTED' },
];

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'deactivate';
    product: Product | null;
  }>({ isOpen: false, action: 'approve', product: null });
  const [successMessage, setSuccessMessage] = useState('');

  const PAGE_SIZE = 10;

  const partnerOptions = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.partnerName))];
    return unique;
  }, []);

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const matchSearch =
        search === '' || p.name.includes(search) || p.brand.includes(search);
      const matchStatus = statusFilter === '' || p.status === statusFilter;
      const matchCategory = categoryFilter === '전체' || p.category === categoryFilter;
      const matchPartner = partnerFilter === '' || p.partnerName === partnerFilter;
      return matchSearch && matchStatus && matchCategory && matchPartner;
    });
  }, [productList, search, statusFilter, categoryFilter, partnerFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const stats = {
    total: productList.length,
    active: productList.filter((p) => p.status === 'ACTIVE').length,
    pending: productList.filter((p) => p.status === 'PENDING').length,
  };

  const handleAction = () => {
    if (!confirmModal.product) return;
    const actionMap: Record<string, ProductStatus> = {
      approve: 'ACTIVE',
      reject: 'REJECTED',
      deactivate: 'INACTIVE',
    };
    const newStatus = actionMap[confirmModal.action];
    setProductList((prev) =>
      prev.map((p) =>
        p.id === confirmModal.product!.id ? { ...p, status: newStatus } : p
      )
    );
    setSuccessMessage(
      confirmModal.action === 'approve' ? '상품이 승인되었습니다.' :
      confirmModal.action === 'reject' ? '상품이 반려되었습니다.' :
      '상품이 비활성화되었습니다.'
    );
    setConfirmModal({ isOpen: false, action: 'approve', product: null });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: '상품명',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.brand}</p>
        </div>
      ),
    },
    { key: 'partnerName', header: '파트너' },
    { key: 'category', header: '카테고리' },
    {
      key: 'faceValue',
      header: '액면가',
      render: (row) => <span className="font-medium">{row.faceValue.toLocaleString('ko-KR')}원</span>,
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => {
        const badge = productStatusBadge(row.status);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: '등록일',
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '액션',
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {row.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => setConfirmModal({ isOpen: true, action: 'approve', product: row })}
              >
                승인
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setConfirmModal({ isOpen: true, action: 'reject', product: row })}
              >
                반려
              </Button>
            </>
          )}
          {row.status === 'ACTIVE' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setConfirmModal({ isOpen: true, action: 'deactivate', product: row })}
            >
              비활성화
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
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '전체 상품', value: stats.total, color: 'text-gray-900' },
          { label: '활성', value: stats.active, color: 'text-emerald-600' },
          { label: '승인대기', value: stats.pending, color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString('ko-KR')}</p>
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
              placeholder="상품명, 브랜드 검색..."
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
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
            >
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(row) => row.id}
        emptyMessage="검색 결과가 없습니다."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: 'approve', product: null })}
        onConfirm={handleAction}
        title={
          confirmModal.action === 'approve' ? '상품 승인' :
          confirmModal.action === 'reject' ? '상품 반려' : '상품 비활성화'
        }
        message={
          confirmModal.action === 'approve'
            ? `${confirmModal.product?.name}을(를) 승인하시겠습니까?`
            : confirmModal.action === 'reject'
            ? `${confirmModal.product?.name}을(를) 반려하시겠습니까?`
            : `${confirmModal.product?.name}을(를) 비활성화하시겠습니까?`
        }
        confirmLabel={
          confirmModal.action === 'approve' ? '승인' :
          confirmModal.action === 'reject' ? '반려' : '비활성화'
        }
        confirmVariant={confirmModal.action === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
}
