'use client';

import { useState } from 'react';
import { Save, FileText } from 'lucide-react';

export default function ProductPolicyPage() {
  const [policy, setPolicy] = useState({
    commissionRate: '5',
    defaultExpiryDays: '365',
    refundPolicy: '7days',
    minFaceValue: '1000',
    maxFaceValue: '500000',
    autoApproval: false,
    requireBrandVerification: true,
  });

  const handleSave = () => {
    alert('상품 정책이 저장되었습니다.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">상품 정책</h2>
        <p className="text-sm text-gray-500 mt-0.5">상품 등록 및 운영에 대한 정책을 설정합니다.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <FileText size={18} className="text-[#7634CB]" />
          기본 정책
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">수수료율 (%)</label>
            <input
              type="number"
              value={policy.commissionRate}
              onChange={(e) => setPolicy((p) => ({ ...p, commissionRate: e.target.value }))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">기본 유효기간 (일)</label>
            <input
              type="number"
              value={policy.defaultExpiryDays}
              onChange={(e) => setPolicy((p) => ({ ...p, defaultExpiryDays: e.target.value }))}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">최소 액면가 (원)</label>
            <input
              type="number"
              value={policy.minFaceValue}
              onChange={(e) => setPolicy((p) => ({ ...p, minFaceValue: e.target.value }))}
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">최대 액면가 (원)</label>
            <input
              type="number"
              value={policy.maxFaceValue}
              onChange={(e) => setPolicy((p) => ({ ...p, maxFaceValue: e.target.value }))}
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">기본 환불 정책</label>
          <div className="space-y-2">
            {[
              { value: '7days', label: '구매 후 7일 이내 환불 가능' },
              { value: 'unused', label: '미사용 상품권 전액 환불' },
              { value: 'none', label: '환불 불가' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="refundPolicy"
                  value={option.value}
                  checked={policy.refundPolicy === option.value}
                  onChange={(e) => setPolicy((p) => ({ ...p, refundPolicy: e.target.value }))}
                  className="text-[#7634CB] focus:ring-[#7634CB]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">승인 설정</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-800">자동 승인</span>
              <p className="text-xs text-gray-500 mt-0.5">조건을 충족한 상품을 자동으로 승인합니다.</p>
            </div>
            <div
              onClick={() => setPolicy((p) => ({ ...p, autoApproval: !p.autoApproval }))}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${policy.autoApproval ? 'bg-[#7634CB]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${policy.autoApproval ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-800">브랜드 인증 필요</span>
              <p className="text-xs text-gray-500 mt-0.5">상품 등록 시 브랜드 인증서류를 요구합니다.</p>
            </div>
            <div
              onClick={() => setPolicy((p) => ({ ...p, requireBrandVerification: !p.requireBrandVerification }))}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${policy.requireBrandVerification ? 'bg-[#7634CB]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${policy.requireBrandVerification ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors"
        >
          <Save size={16} />
          정책 저장
        </button>
      </div>
    </div>
  );
}
