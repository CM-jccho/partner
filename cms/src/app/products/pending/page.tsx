'use client';

import { useState } from 'react';
import { Package, CheckCircle, Calendar, Tag } from 'lucide-react';
import Badge, { productStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { products, Product, ProductStatus } from '@/data/mock';
import { formatDate } from '@/lib/utils';

export default function ProductsPendingPage() {
  const [pendingList, setPendingList] = useState<Product[]>(
    products.filter((p) => p.status === 'PENDING')
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<Record<string, boolean>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'batch_approve';
    product: Product | null;
  }>({ isOpen: false, action: 'approve', product: null });
  const [successMessage, setSuccessMessage] = useState('');

  const handleAction = () => {
    if (confirmModal.action === 'batch_approve') {
      setPendingList((prev) => prev.filter((p) => !selected.has(p.id)));
      setSelected(new Set());
      setSuccessMessage(`${selected.size}개 상품이 일괄 승인되었습니다.`);
    } else if (confirmModal.product) {
      setPendingList((prev) => prev.filter((p) => p.id !== confirmModal.product!.id));
      setSuccessMessage(
        confirmModal.action === 'approve'
          ? `${confirmModal.product.name}이(가) 승인되었습니다.`
          : `${confirmModal.product.name}이(가) 반려되었습니다.`
      );
    }
    setConfirmModal({ isOpen: false, action: 'approve', product: null });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === pendingList.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pendingList.map((p) => p.id)));
    }
  };

  return (
    <div className="space-y-5">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2 text-amber-700">
            <Package size={16} />
            <span className="text-sm font-medium">승인 대기 상품 {pendingList.length}건</span>
          </div>
          {selected.size > 0 && (
            <span className="text-sm text-gray-500">{selected.size}개 선택됨</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {pendingList.length > 0 && (
            <Button variant="secondary" size="sm" onClick={toggleAll}>
              {selected.size === pendingList.length ? '전체 해제' : '전체 선택'}
            </Button>
          )}
          {selected.size > 0 && (
            <Button
              variant="success"
              size="sm"
              onClick={() => setConfirmModal({ isOpen: true, action: 'batch_approve', product: null })}
            >
              일괄 승인 ({selected.size}개)
            </Button>
          )}
        </div>
      </div>

      {/* Product Cards */}
      {pendingList.length === 0 ? (
        <div className="bg-white rounded-xl p-20 text-center border border-gray-100 shadow-sm">
          <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">승인 대기중인 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingList.map((product) => {
            const badge = productStatusBadge(product.status);
            const isSelected = selected.has(product.id);
            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  isSelected ? 'border-[#004399] ring-1 ring-[#004399]/30' : 'border-gray-100'
                }`}
              >
                <div className="px-5 py-4 flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(product.id)}
                    className="mt-1 w-4 h-4 accent-[#004399] cursor-pointer flex-shrink-0"
                  />

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#004399]/10 flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-[#004399]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{product.partnerName} · {product.brand}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>{formatDate(product.submittedAt)} 제출</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">카테고리</p>
                        <p className="text-sm font-medium text-gray-900">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">액면가</p>
                        <p className="text-sm font-medium text-gray-900">{product.faceValue.toLocaleString('ko-KR')}원</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">유효기간</p>
                        <p className="text-sm font-medium text-gray-900">{product.validityDays}일</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">브랜드</p>
                        <p className="text-sm font-medium text-gray-900">{product.brand}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-4">
                      {product.description}
                    </p>

                    {/* Rejection Reason Input */}
                    {showRejectInput[product.id] && (
                      <div className="mb-4">
                        <label className="text-xs font-medium text-gray-700 block mb-1.5">
                          반려 사유 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={rejectReasons[product.id] || ''}
                          onChange={(e) =>
                            setRejectReasons((prev) => ({ ...prev, [product.id]: e.target.value }))
                          }
                          placeholder="반려 사유를 입력해주세요..."
                          rows={2}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#004399] resize-none"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (!showRejectInput[product.id]) {
                            setShowRejectInput((prev) => ({ ...prev, [product.id]: true }));
                          } else if (rejectReasons[product.id]) {
                            setConfirmModal({ isOpen: true, action: 'reject', product });
                          }
                        }}
                        disabled={showRejectInput[product.id] && !rejectReasons[product.id]}
                      >
                        반려
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setConfirmModal({ isOpen: true, action: 'approve', product })}
                      >
                        승인하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: 'approve', product: null })}
        onConfirm={handleAction}
        title={
          confirmModal.action === 'batch_approve' ? '일괄 승인 확인' :
          confirmModal.action === 'approve' ? '상품 승인' : '상품 반려'
        }
        message={
          confirmModal.action === 'batch_approve'
            ? `선택한 ${selected.size}개 상품을 모두 승인하시겠습니까?`
            : confirmModal.action === 'approve'
            ? `${confirmModal.product?.name}을(를) 승인하시겠습니까?`
            : `${confirmModal.product?.name}을(를) 반려하시겠습니까?`
        }
        confirmLabel={confirmModal.action === 'reject' ? '반려' : '승인'}
        confirmVariant={confirmModal.action === 'reject' ? 'danger' : 'success'}
      />
    </div>
  );
}
