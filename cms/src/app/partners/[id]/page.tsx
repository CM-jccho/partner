'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2, Phone, Mail, CreditCard, MapPin,
  Package, ShoppingCart, DollarSign, CheckCircle, ArrowLeft,
} from 'lucide-react';
import Badge, { partnerStatusBadge, productStatusBadge, orderStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { partners, products, orders, settlementData, PartnerStatus } from '@/data/mock';
import { formatKRW, formatDate, formatDateTime } from '@/lib/utils';

export default function PartnerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState(partners.find((p) => p.id === id));
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'suspend' | 'activate';
  }>({ isOpen: false, action: 'approve' });
  const [successMessage, setSuccessMessage] = useState('');

  if (!partner) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>파트너를 찾을 수 없습니다.</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/partners')}>
          목록으로
        </Button>
      </div>
    );
  }

  const partnerProducts = products.filter((p) => p.partnerId === id).slice(0, 5);
  const partnerOrders = orders.filter((o) => o.partnerId === id).slice(0, 5);
  const partnerSettlements = settlementData.filter((s) => s.partnerId === id);

  const badge = partnerStatusBadge(partner.status);

  const handleAction = () => {
    const actionMap: Record<string, PartnerStatus> = {
      approve: 'ACTIVE',
      reject: 'REJECTED',
      suspend: 'SUSPENDED',
      activate: 'ACTIVE',
    };
    const newStatus = actionMap[confirmModal.action];
    setPartner((prev) => prev ? { ...prev, status: newStatus } : prev);
    setSuccessMessage(
      confirmModal.action === 'approve' ? '파트너가 승인되었습니다.' :
      confirmModal.action === 'reject' ? '파트너가 거절되었습니다.' :
      confirmModal.action === 'suspend' ? '파트너가 정지되었습니다.' :
      '파트너가 활성화되었습니다.'
    );
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => setSuccessMessage(''), 3000);
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/partners')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{partner.name}</h2>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="text-sm text-gray-500">사업자번호: {partner.businessNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {partner.status === 'PENDING' && (
            <>
              <Button
                variant="success"
                onClick={() => setConfirmModal({ isOpen: true, action: 'approve' })}
              >
                승인하기
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmModal({ isOpen: true, action: 'reject' })}
              >
                거절하기
              </Button>
            </>
          )}
          {partner.status === 'ACTIVE' && (
            <Button
              variant="danger"
              onClick={() => setConfirmModal({ isOpen: true, action: 'suspend' })}
            >
              정지하기
            </Button>
          )}
          {partner.status === 'SUSPENDED' && (
            <Button
              variant="success"
              onClick={() => setConfirmModal({ isOpen: true, action: 'activate' })}
            >
              활성화
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Partner Info */}
        <div className="col-span-2 space-y-5">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">법인명</p>
                  <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">대표자</p>
                  <p className="text-sm font-medium text-gray-900">{partner.ceoName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">이메일</p>
                  <p className="text-sm font-medium text-gray-900">{partner.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">연락처</p>
                  <p className="text-sm font-medium text-gray-900">{partner.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 col-span-2">
                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">주소</p>
                  <p className="text-sm font-medium text-gray-900">{partner.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">정산 계좌</p>
                  <p className="text-sm font-medium text-gray-900">{partner.bankName} {partner.bankAccount}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">수수료율</p>
                  <p className="text-sm font-medium text-gray-900">{partner.commissionRate}%</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 mb-3">상태 이력</h4>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>신청: {formatDate(partner.appliedAt)}</span>
                </div>
                {partner.approvedAt && (
                  <>
                    <div className="w-8 h-px bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>승인: {formatDate(partner.approvedAt)}</span>
                    </div>
                  </>
                )}
                {partner.status === 'SUSPENDED' && (
                  <>
                    <div className="w-8 h-px bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span>정지됨</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">최근 상품 목록</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">상품명</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">카테고리</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">액면가</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {partnerProducts.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">등록된 상품이 없습니다.</td></tr>
                ) : (
                  partnerProducts.map((product) => {
                    const pBadge = productStatusBadge(product.status);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{product.category}</td>
                        <td className="px-4 py-3 text-gray-900">{product.faceValue.toLocaleString('ko-KR')}원</td>
                        <td className="px-4 py-3"><Badge variant={pBadge.variant}>{pBadge.label}</Badge></td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(product.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">최근 주문 현황</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">주문번호</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">구매자</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">금액</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">주문일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {partnerOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">주문 내역이 없습니다.</td></tr>
                ) : (
                  partnerOrders.map((order) => {
                    const oBadge = orderStatusBadge(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-[#004399]">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-gray-700">{order.buyerName}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{formatKRW(order.amount * order.quantity)}</td>
                        <td className="px-4 py-3"><Badge variant={oBadge.variant}>{oBadge.label}</Badge></td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(order.orderedAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Service Summary */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">서비스 현황</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={16} />
                  <span className="text-sm">활성 상품</span>
                </div>
                <span className="font-bold text-gray-900">{partner.totalProducts}개</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <ShoppingCart size={16} />
                  <span className="text-sm">이번달 주문</span>
                </div>
                <span className="font-bold text-gray-900">
                  {partnerOrders.filter((o) => o.status === 'COMPLETED').length}건
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} />
                  <span className="text-sm">이번달 매출</span>
                </div>
                <span className="font-bold text-gray-900">
                  {partner.monthlyRevenue > 0 ? formatKRW(partner.monthlyRevenue) : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Settlement History */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">정산 히스토리</h3>
            {partnerSettlements.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">정산 내역이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {partnerSettlements.map((s) => (
                  <div key={s.month} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{s.month}</span>
                      <Badge variant={s.status === 'COMPLETED' ? 'success' : s.status === 'PROCESSING' ? 'info' : 'warning'}>
                        {s.status === 'COMPLETED' ? '완료' : s.status === 'PROCESSING' ? '처리중' : '대기'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>매출</span>
                        <span className="font-medium">{formatKRW(s.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>수수료 ({s.commissionRate}%)</span>
                        <span className="text-red-600">-{formatKRW(s.commissionAmount)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-900 border-t border-gray-100 pt-1">
                        <span>정산금액</span>
                        <span>{formatKRW(s.settlementAmount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleAction}
        title={
          confirmModal.action === 'approve' ? '파트너 승인' :
          confirmModal.action === 'reject' ? '파트너 거절' :
          confirmModal.action === 'suspend' ? '파트너 정지' : '파트너 활성화'
        }
        message={
          confirmModal.action === 'approve' ? `${partner.name}을(를) 승인하시겠습니까?` :
          confirmModal.action === 'reject' ? `${partner.name}을(를) 거절하시겠습니까?` :
          confirmModal.action === 'suspend' ? `${partner.name}을(를) 정지하시겠습니까? 모든 서비스가 중단됩니다.` :
          `${partner.name}을(를) 활성화하시겠습니까?`
        }
        confirmLabel={
          confirmModal.action === 'approve' ? '승인' :
          confirmModal.action === 'reject' ? '거절' :
          confirmModal.action === 'suspend' ? '정지' : '활성화'
        }
        confirmVariant={
          confirmModal.action === 'approve' || confirmModal.action === 'activate' ? 'success' : 'danger'
        }
      />
    </div>
  );
}
