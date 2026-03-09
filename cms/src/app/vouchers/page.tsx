'use client';

import { useState, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { vouchers, Voucher, VoucherStatus, partners } from '@/data/mock';
import { formatDate, formatDateTime, formatKRW } from '@/lib/utils';

const statusLabel: Record<VoucherStatus, string> = {
  ACTIVE: '활성',
  USED: '사용완료',
  EXPIRED: '만료',
  CANCELED: '취소됨',
};

const voucherStatusBadge = (status: VoucherStatus): React.ComponentProps<typeof Badge>['variant'] => {
  const map: Record<VoucherStatus, React.ComponentProps<typeof Badge>['variant']> = {
    ACTIVE: 'success',
    USED: 'info',
    EXPIRED: 'warning',
    CANCELED: 'danger',
  };
  return map[status];
};

export default function VouchersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [voucherList, setVoucherList] = useState<Voucher[]>(vouchers);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucher: Voucher | null; action: 'expire' | 'resend' }>({
    isOpen: false, voucher: null, action: 'expire',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    return voucherList.filter((v) => {
      const matchSearch = search === '' || v.code.toLowerCase().includes(search.toLowerCase()) || v.recipientName.includes(search) || v.recipientPhone.includes(search);
      const matchStatus = statusFilter === '' || v.status === statusFilter;
      const matchPartner = partnerFilter === '' || v.partnerId === partnerFilter;
      return matchSearch && matchStatus && matchPartner;
    });
  }, [voucherList, search, statusFilter, partnerFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const stats = {
    total: voucherList.length,
    active: voucherList.filter((v) => v.status === 'ACTIVE').length,
    used: voucherList.filter((v) => v.status === 'USED').length,
    expired: voucherList.filter((v) => v.status === 'EXPIRED').length,
    canceled: voucherList.filter((v) => v.status === 'CANCELED').length,
  };

  const handleAction = () => {
    if (!confirmModal.voucher) return;
    if (confirmModal.action === 'expire') {
      setVoucherList((prev) => prev.map((v) => v.id === confirmModal.voucher!.id ? { ...v, status: 'EXPIRED' as VoucherStatus } : v));
      setSuccessMsg(`바우처 ${confirmModal.voucher.code} 강제 만료 처리되었습니다.`);
    } else {
      setSuccessMsg(`${confirmModal.voucher.recipientName}님께 상품권이 재발송되었습니다.`);
    }
    setConfirmModal({ isOpen: false, voucher: null, action: 'expire' });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">상품권 관리</h2>
        <p className="text-sm text-gray-500 mt-0.5">플랫폼 전체 상품권 현황을 관리합니다.</p>
      </div>

      {successMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{successMsg}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: '전체', value: stats.total, color: 'text-gray-900' },
          { label: '활성', value: stats.active, color: 'text-green-600' },
          { label: '사용완료', value: stats.used, color: 'text-gray-500' },
          { label: '만료', value: stats.expired, color: 'text-yellow-600' },
          { label: '취소', value: stats.canceled, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="바우처코드, 수신자명, 전화번호"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="USED">사용완료</option>
            <option value="EXPIRED">만료</option>
            <option value="CANCELED">취소</option>
          </select>
          <select
            value={partnerFilter}
            onChange={(e) => { setPartnerFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="">전체 파트너</option>
            {partners.filter(p => p.status === 'ACTIVE').map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-gray-800">상품권 목록 <span className="text-gray-400 font-normal text-sm">({filtered.length}건)</span></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['바우처코드', '파트너', '상품명', '수신자', '액면가', '발행일', '만료일', '상태', '액션'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-gray-400">조회된 상품권이 없습니다.</td></tr>
              ) : (
                paginated.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{v.code}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap max-w-[100px] truncate">{v.partnerName}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[140px] truncate">{v.productName}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      <div>{v.recipientName}</div>
                      <div className="text-xs text-gray-400">{v.recipientPhone}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{formatKRW(v.faceValue)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(v.issuedAt)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(v.expiredAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={voucherStatusBadge(v.status)}>{statusLabel[v.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {v.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, voucher: v, action: 'resend' })}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <RefreshCw size={11} />
                              재발송
                            </button>
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, voucher: v, action: 'expire' })}
                              className="px-2.5 py-1 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              강제만료
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">{filtered.length}건 중 {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}-{Math.min(page * PAGE_SIZE, filtered.length)}건</span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-[#004399] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, voucher: null, action: 'expire' })}
        onConfirm={handleAction}
        title={confirmModal.action === 'expire' ? '강제 만료 처리' : '상품권 재발송'}
        message={confirmModal.action === 'expire'
          ? `바우처 ${confirmModal.voucher?.code}를 강제 만료 처리하시겠습니까?`
          : `${confirmModal.voucher?.recipientName}님께 상품권을 재발송하시겠습니까?`}
        confirmLabel={confirmModal.action === 'expire' ? '강제 만료' : '재발송'}
        confirmVariant={confirmModal.action === 'expire' ? 'danger' : 'primary'}
      />
    </div>
  );
}
