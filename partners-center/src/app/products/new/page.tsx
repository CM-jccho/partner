'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Check, Upload, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

const STEPS = ['기본 정보', '정책 설정', '확인 및 제출'];

const categories = [
  '카페/음료',
  '외식/배달',
  '편의점',
  '마트/쇼핑',
  '뷰티/헬스',
  '엔터테인먼트',
  '도서/문구',
  '백화점/명품',
  '기타',
];

interface FormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  faceValue: string;
  sellingPrice: string;
  stock: string;
  expiryDays: string;
  refundPolicy: string;
  usageLocations: string[];
}

const initialFormData: FormData = {
  name: '',
  brand: '',
  category: '',
  description: '',
  faceValue: '',
  sellingPrice: '',
  stock: '',
  expiryDays: '365',
  refundPolicy: '7days',
  usageLocations: [],
};

export default function ProductNewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [newLocation, setNewLocation] = useState('');

  const updateForm = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = '상품명을 입력하세요.';
    if (!form.brand.trim()) newErrors.brand = '브랜드를 입력하세요.';
    if (!form.category) newErrors.category = '카테고리를 선택하세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.faceValue || isNaN(Number(form.faceValue))) newErrors.faceValue = '올바른 액면가를 입력하세요.';
    if (!form.sellingPrice || isNaN(Number(form.sellingPrice))) newErrors.sellingPrice = '올바른 판매가를 입력하세요.';
    if (!form.stock || isNaN(Number(form.stock))) newErrors.stock = '올바른 재고 수량을 입력하세요.';
    if (!form.expiryDays || isNaN(Number(form.expiryDays))) newErrors.expiryDays = '올바른 유효기간을 입력하세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateStep1()) return;
    if (currentStep === 1 && !validateStep2()) return;
    setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !form.usageLocations.includes(newLocation.trim())) {
      updateForm('usageLocations', [...form.usageLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    updateForm('usageLocations', form.usageLocations.filter((l) => l !== loc));
  };

  const handleSubmit = () => {
    alert('상품이 승인 요청되었습니다. 담당자 승인 후 판매가 시작됩니다.');
    router.push('/products');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/products"
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900">상품 등록</h2>
          <p className="text-sm text-gray-500">새 모바일 상품권을 등록합니다.</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                    idx < currentStep
                      ? 'bg-green-500 text-white'
                      : idx === currentStep
                      ? 'bg-[#7634CB] text-white'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {idx < currentStep ? <Check size={16} /> : idx + 1}
                </div>
                <span
                  className={clsx(
                    'text-sm font-medium hidden sm:block',
                    idx === currentStep ? 'text-[#7634CB]' : 'text-gray-400'
                  )}
                >
                  {step}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mx-3',
                    idx < currentStep ? 'bg-green-400' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {currentStep === 0 && (
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              기본 정보
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                상품명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="예: 스타벅스 아메리카노 교환권"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                  errors.name ? 'border-red-400' : 'border-gray-200'
                )}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                브랜드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                placeholder="예: 스타벅스"
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                  errors.brand ? 'border-red-400' : 'border-gray-200'
                )}
              />
              {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                className={clsx(
                  'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all bg-white',
                  errors.category ? 'border-red-400' : 'border-gray-200'
                )}
              >
                <option value="">카테고리 선택</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">상품 설명</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="상품에 대한 설명을 입력하세요."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">썸네일 이미지</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#7634CB]/40 transition-colors cursor-pointer group">
                <Upload size={28} className="mx-auto text-gray-300 group-hover:text-[#7634CB] transition-colors mb-2" />
                <p className="text-sm text-gray-400">이미지를 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-gray-300 mt-1">PNG, JPG 최대 5MB</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              정책 설정
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  액면가 (원) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.faceValue}
                  onChange={(e) => updateForm('faceValue', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                    errors.faceValue ? 'border-red-400' : 'border-gray-200'
                  )}
                />
                {errors.faceValue && <p className="text-xs text-red-500 mt-1">{errors.faceValue}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  판매가 (원) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.sellingPrice}
                  onChange={(e) => updateForm('sellingPrice', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                    errors.sellingPrice ? 'border-red-400' : 'border-gray-200'
                  )}
                />
                {errors.sellingPrice && <p className="text-xs text-red-500 mt-1">{errors.sellingPrice}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  재고 수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateForm('stock', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                    errors.stock ? 'border-red-400' : 'border-gray-200'
                  )}
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  유효기간 (일) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.expiryDays}
                  onChange={(e) => updateForm('expiryDays', e.target.value)}
                  placeholder="365"
                  min="1"
                  className={clsx(
                    'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                    errors.expiryDays ? 'border-red-400' : 'border-gray-200'
                  )}
                />
                {errors.expiryDays && <p className="text-xs text-red-500 mt-1">{errors.expiryDays}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">환불 정책</label>
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
                      checked={form.refundPolicy === option.value}
                      onChange={(e) => updateForm('refundPolicy', e.target.value)}
                      className="text-[#7634CB] focus:ring-[#7634CB]"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">사용처</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLocation(); } }}
                  placeholder="사용처 입력 후 추가"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
                />
                <button
                  onClick={handleAddLocation}
                  className="px-4 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              {form.usageLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.usageLocations.map((loc) => (
                    <span
                      key={loc}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-[#7634CB] rounded-full text-sm"
                    >
                      {loc}
                      <button onClick={() => handleRemoveLocation(loc)} className="text-[#7634CB]/60 hover:text-[#7634CB]">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              확인 및 제출
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">기본 정보</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">상품명</span><p className="font-medium text-gray-900 mt-0.5">{form.name || '-'}</p></div>
                  <div><span className="text-gray-500">브랜드</span><p className="font-medium text-gray-900 mt-0.5">{form.brand || '-'}</p></div>
                  <div><span className="text-gray-500">카테고리</span><p className="font-medium text-gray-900 mt-0.5">{form.category || '-'}</p></div>
                  <div className="col-span-2"><span className="text-gray-500">상품 설명</span><p className="font-medium text-gray-900 mt-0.5">{form.description || '-'}</p></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">정책 정보</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">액면가</span><p className="font-medium text-gray-900 mt-0.5">{form.faceValue ? `${Number(form.faceValue).toLocaleString()}원` : '-'}</p></div>
                  <div><span className="text-gray-500">판매가</span><p className="font-medium text-gray-900 mt-0.5">{form.sellingPrice ? `${Number(form.sellingPrice).toLocaleString()}원` : '-'}</p></div>
                  <div><span className="text-gray-500">재고</span><p className="font-medium text-gray-900 mt-0.5">{form.stock ? `${Number(form.stock).toLocaleString()}개` : '-'}</p></div>
                  <div><span className="text-gray-500">유효기간</span><p className="font-medium text-gray-900 mt-0.5">{form.expiryDays ? `${form.expiryDays}일` : '-'}</p></div>
                  <div><span className="text-gray-500">환불 정책</span><p className="font-medium text-gray-900 mt-0.5">{form.refundPolicy === '7days' ? '구매 후 7일 이내' : form.refundPolicy === 'unused' ? '미사용 전액 환불' : '환불 불가'}</p></div>
                  <div><span className="text-gray-500">사용처</span><p className="font-medium text-gray-900 mt-0.5">{form.usageLocations.length > 0 ? form.usageLocations.join(', ') : '-'}</p></div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  승인 요청 후 담당자 검토 (1-2 영업일)가 완료되면 판매가 시작됩니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          이전
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors"
          >
            다음
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors"
          >
            <Check size={16} />
            승인 요청
          </button>
        )}
      </div>
    </div>
  );
}
