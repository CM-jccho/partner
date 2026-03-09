'use client';

import { useState } from 'react';
import {
  Building2, Mail, Phone, MapPin, CheckCircle, Calendar,
} from 'lucide-react';
import Badge, { partnerStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { partners, Partner, PartnerStatus } from '@/data/mock';
import { formatDate } from '@/lib/utils';

export default function PartnersPendingPage() {
  const [pendingList, setPendingList] = useState<Partner[]>(
    partners.filter((p) => p.status === 'PENDING')
  );
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<Record<string, boolean>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject';
    partner: Partner | null;
  }>({ isOpen: false, action: 'approve', partner: null });
  const [successMessage, setSuccessMessage] = useState('');

  const handleAction = () => {
    if (!confirmModal.partner) return;
    const newStatus: PartnerStatus = confirmModal.action === 'approve' ? 'ACTIVE' : 'REJECTED';
    setPendingList((prev) => prev.filter((p) => p.id !== confirmModal.partner!.id));
    setSuccessMessage(
      confirmModal.action === 'approve'
        ? `${confirmModal.partner.name}이(가) 승인되었습니다.`
        : `${confirmModal.partner.name}이(가) 거절되었습니다.`
    );
    setConfirmModal({ isOpen: false, action: 'approve', partner: null });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const openApprove = (partner: Partner) => {
    setConfirmModal({ isOpen: true, action: 'approve', partner });
  };

  const openReject = (partner: Partner) => {
    if (!rejectReasons[partner.id]) {
      setShowRejectInput((prev) => ({ ...prev, [partner.id]: true }));
      return;
    }
    setConfirmModal({ isOpen: true, action: 'reject', partner });
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

      {/* Summary Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-700">
          <Building2 size={18} />
          <span className="font-medium">승인 대기 파트너 {pendingList.length}건</span>
          <span className="text-amber-500 text-sm">검토 후 승인/거절 처리해주세요.</span>
        </div>
      </div>

      {/* Partner Cards */}
      {pendingList.length === 0 ? (
        <div className="bg-white rounded-xl p-20 text-center border border-gray-100 shadow-sm">
          <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">승인 대기중인 파트너가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingList.map((partner) => {
            const badge = partnerStatusBadge(partner.status);
            return (
              <div key={partner.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#004399]/10 flex items-center justify-center">
                      <Building2 size={18} className="text-[#004399]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{partner.name}</h3>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">사업자번호: {partner.businessNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={13} />
                    <span>{formatDate(partner.appliedAt)} 신청</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Building2 size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">대표자</p>
                        <p className="text-sm font-medium text-gray-900">{partner.ceoName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">이메일</p>
                        <p className="text-sm font-medium text-gray-900">{partner.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">연락처</p>
                        <p className="text-sm font-medium text-gray-900">{partner.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 col-span-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">주소</p>
                        <p className="text-sm font-medium text-gray-900">{partner.address}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">카테고리</p>
                      <p className="text-sm font-medium text-gray-900">{partner.category}</p>
                    </div>
                  </div>

                  {/* Rejection Reason Input */}
                  {showRejectInput[partner.id] && (
                    <div className="mb-4">
                      <label className="text-xs font-medium text-gray-700 block mb-1.5">
                        거절 사유 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={rejectReasons[partner.id] || ''}
                        onChange={(e) =>
                          setRejectReasons((prev) => ({ ...prev, [partner.id]: e.target.value }))
                        }
                        placeholder="거절 사유를 입력해주세요..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#004399] resize-none"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openReject(partner)}
                      disabled={showRejectInput[partner.id] && !rejectReasons[partner.id]}
                    >
                      거절
                    </Button>
                    <Button variant="success" size="sm" onClick={() => openApprove(partner)}>
                      승인하기
                    </Button>
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
        onClose={() => setConfirmModal({ isOpen: false, action: 'approve', partner: null })}
        onConfirm={handleAction}
        title={confirmModal.action === 'approve' ? '파트너 승인' : '파트너 거절'}
        message={
          confirmModal.action === 'approve'
            ? `${confirmModal.partner?.name}을(를) 파트너로 승인하시겠습니까? 승인 즉시 서비스가 활성화됩니다.`
            : `${confirmModal.partner?.name}을(를) 거절하시겠습니까? 거절 사유: ${rejectReasons[confirmModal.partner?.id || ''] || '미입력'}`
        }
        confirmLabel={confirmModal.action === 'approve' ? '승인' : '거절'}
        confirmVariant={confirmModal.action === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
}
