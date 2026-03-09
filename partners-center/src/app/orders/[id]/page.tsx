'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X, Package, User, MapPin, CreditCard, Gift } from 'lucide-react';
import { orders, vouchers, formatCurrency } from '@/data/mock';
import { clsx } from 'clsx';

const statusLabels: Record<string, string> = {
  CREATED: '주문완료',
  PAID: '결제완료',
  CANCEL_REQUESTED: '취소요청',
  CANCELED: '취소완료',
};

const statusColors: Record<string, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  CANCEL_REQUESTED: 'bg-yellow-100 text-yellow-700',
  CANCELED: 'bg-gray-100 text-gray-500',
};

const orderSteps = ['주문접수', '결제완료', '상품권발행', '전달완료'];

const getStepIndex = (status: string) => {
  switch (status) {
    case 'CREATED': return 0;
    case 'PAID': return 1;
    case 'CANCEL_REQUESTED': return 1;
    case 'CANCELED': return -1;
    default: return 0;
  }
};

const voucherStatusLabels: Record<string, string> = {
  ISSUED: '발행됨',
  DELIVERED: '전달됨',
  REDEEMED: '사용완료',
  EXPIRED: '만료됨',
};

const voucherStatusColors: Record<string, string> = {
  ISSUED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-purple-100 text-purple-700',
  REDEEMED: 'bg-green-100 text-green-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const order = orders.find((o) => o.id === orderId);
  const orderVouchers = vouchers.filter((v) => v.orderId === orderId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-sm mb-4">주문을 찾을 수 없습니다.</p>
        <Link href="/orders" className="text-[#7634CB] hover:underline text-sm">
          주문 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">주문 상세</h2>
            <p className="text-xs font-mono text-gray-400 mt-0.5">{order.orderNumber}</p>
          </div>
        </div>
        <span
          className={clsx(
            'px-3 py-1.5 rounded-full text-sm font-medium',
            statusColors[order.status]
          )}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      {/* Order Status Timeline */}
      {order.status !== 'CANCELED' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">주문 진행 상황</h3>
          <div className="flex items-center">
            {orderSteps.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                      idx <= currentStep
                        ? 'bg-[#7634CB] text-white'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {idx <= currentStep ? <Check size={16} /> : idx + 1}
                  </div>
                  <span
                    className={clsx(
                      'text-xs mt-2 whitespace-nowrap',
                      idx <= currentStep ? 'text-[#7634CB] font-medium' : 'text-gray-400'
                    )}
                  >
                    {step}
                  </span>
                </div>
                {idx < orderSteps.length - 1 && (
                  <div
                    className={clsx(
                      'flex-1 h-0.5 mb-4',
                      idx < currentStep ? 'bg-[#7634CB]' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Banner */}
      {order.status === 'CANCELED' && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
            <X size={20} />
            <span className="font-medium">취소된 주문입니다.</span>
          </div>
          <p className="text-xs text-gray-400">주문이 취소 처리되었습니다.</p>
        </div>
      )}

      {/* Product Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Package size={16} className="text-[#7634CB]" />
          상품 정보
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 text-xs">상품명</span>
            <p className="font-medium text-gray-900 mt-0.5">{order.productName}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">채널</span>
            <p className="font-medium text-gray-900 mt-0.5">{order.channelName}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">수량</span>
            <p className="font-medium text-gray-900 mt-0.5">{order.quantity}개</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">주문일시</span>
            <p className="font-medium text-gray-900 mt-0.5">{order.createdAt}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Buyer Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <User size={16} className="text-[#7634CB]" />
            구매자 정보
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 text-xs">이름</span>
              <p className="font-medium text-gray-900 mt-0.5">{order.buyerName}</p>
            </div>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#7634CB]" />
            수신자 정보
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500 text-xs">이름</span>
              <p className="font-medium text-gray-900 mt-0.5">{order.recipientName}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs">연락처</span>
              <p className="font-medium text-gray-900 mt-0.5">{order.recipientPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <CreditCard size={16} className="text-[#7634CB]" />
          결제 정보
        </h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 text-gray-500">상품 금액</td>
              <td className="py-2.5 text-right font-medium text-gray-900">{formatCurrency(order.amount)}</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 text-gray-500">수량</td>
              <td className="py-2.5 text-right font-medium text-gray-900">{order.quantity}개</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 text-gray-500">할인</td>
              <td className="py-2.5 text-right font-medium text-gray-900">-</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-gray-900">최종 결제금액</td>
              <td className="py-2.5 text-right font-bold text-[#7634CB] text-base">{formatCurrency(order.amount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Voucher Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Gift size={16} className="text-[#7634CB]" />
          상품권 현황
        </h3>
        {orderVouchers.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Gift size={32} className="mb-2 opacity-30" />
            <p className="text-sm">발행된 상품권이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderVouchers.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-xs font-mono text-gray-500">{v.voucherCode}</span>
                  <div className="text-xs text-gray-400 mt-0.5">만료: {v.expiresAt}</div>
                </div>
                <span
                  className={clsx(
                    'text-xs px-2.5 py-1 rounded-full font-medium',
                    voucherStatusColors[v.status]
                  )}
                >
                  {voucherStatusLabels[v.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {order.status === 'CANCEL_REQUESTED' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5 shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-800">취소 요청이 접수되었습니다.</p>
              <p className="text-xs text-yellow-700 mt-1">구매자가 주문 취소를 요청했습니다. 취소 승인 또는 거절을 선택하세요.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
              <X size={16} />
              취소 승인
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Check size={16} />
              취소 거절
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
