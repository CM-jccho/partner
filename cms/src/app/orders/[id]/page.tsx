'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User, Phone, Mail, CreditCard, Hash } from 'lucide-react';
import Badge, { orderStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { orders, vouchers } from '@/data/mock';
import { formatKRW, formatDateTime, formatDate } from '@/lib/utils';
import { useState } from 'react';

const CHANNEL_LABELS: Record<string, string> = {
  KAKAO: '카카오',
  NAVER: '네이버',
  DIRECT: '직접',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cancelModal, setCancelModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-gray-500">주문을 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={() => router.back()}>돌아가기</Button>
      </div>
    );
  }

  const statusBadge = orderStatusBadge(order.status);
  const relatedVoucher = vouchers.find((v) => v.orderId === order.id);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900">{order.orderNumber}</h2>
          <p className="text-sm text-gray-500">{formatDateTime(order.orderedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          {(order.status === 'COMPLETED' || order.status === 'PROCESSING') && (
            <Button variant="danger" size="sm" onClick={() => setCancelModal(true)}>
              주문 취소
            </Button>
          )}
          {order.status === 'COMPLETED' && (
            <Button variant="secondary" size="sm" onClick={() => setRefundModal(true)}>
              환불 처리
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: order info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">주문 상태</h3>
            <div className="flex items-center gap-3">
              <Badge variant={statusBadge.variant} className="text-sm px-3 py-1">
                {statusBadge.label}
              </Badge>
              <span className="text-sm text-gray-500">채널: {CHANNEL_LABELS[order.channel] ?? order.channel}</span>
              <span className="text-sm text-gray-500">결제: {order.paymentMethod}</span>
            </div>
          </div>

          {/* Product */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Package size={15} className="text-[#004399]" />
              상품 정보
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">파트너</span>
                <span className="font-medium text-gray-900">{order.partnerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">상품명</span>
                <span className="font-medium text-gray-900">{order.productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">단가</span>
                <span className="font-medium text-gray-900">{formatKRW(order.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">수량</span>
                <span className="font-medium text-gray-900">{order.quantity}개</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                <span className="font-semibold text-gray-700">총 결제금액</span>
                <span className="font-bold text-[#004399]">{formatKRW(order.amount * order.quantity)}</span>
              </div>
            </div>
          </div>

          {/* Voucher */}
          {relatedVoucher && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Hash size={15} className="text-[#004399]" />
                발급 상품권
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">상품권 코드</span>
                  <span className="font-mono font-medium text-gray-900">{relatedVoucher.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">발급일시</span>
                  <span className="text-gray-700">{formatDateTime(relatedVoucher.issuedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">만료일</span>
                  <span className="text-gray-700">{formatDate(relatedVoucher.expiredAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">사용일시</span>
                  <span className="text-gray-700">
                    {relatedVoucher.usedAt ? formatDateTime(relatedVoucher.usedAt) : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">상태</span>
                  <Badge variant={relatedVoucher.status === 'ACTIVE' ? 'success' : relatedVoucher.status === 'USED' ? 'info' : 'gray'}>
                    {relatedVoucher.status === 'ACTIVE' ? '활성' : relatedVoucher.status === 'USED' ? '사용됨' : relatedVoucher.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: buyer / recipient */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <User size={15} className="text-[#004399]" />
              구매자 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-900">{order.buyerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{order.buyerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 break-all">{order.buyerEmail}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <CreditCard size={15} className="text-[#004399]" />
              수신자 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-900">{order.recipientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{order.recipientPhone}</span>
              </div>
            </div>
          </div>

          {order.voucherCode && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">발급 코드</p>
              <p className="font-mono text-sm text-blue-900 font-bold">{order.voucherCode}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={() => setCancelModal(false)}
        title="주문 취소"
        message={`${order.orderNumber} 주문을 취소하시겠습니까? 취소 후에는 복구할 수 없습니다.`}
        confirmLabel="취소 처리"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={refundModal}
        onClose={() => setRefundModal(false)}
        onConfirm={() => setRefundModal(false)}
        title="환불 처리"
        message={`${formatKRW(order.amount * order.quantity)} 결제금액을 환불 처리하시겠습니까?`}
        confirmLabel="환불 처리"
        confirmVariant="primary"
      />
    </div>
  );
}
