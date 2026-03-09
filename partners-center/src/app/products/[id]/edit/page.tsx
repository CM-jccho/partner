'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { products, formatCurrency } from '@/data/mock';
import { clsx } from 'clsx';

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

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const product = products.find((p) => p.id === productId);

  const [form, setForm] = useState({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    category: product?.category ?? '',
    description: '',
    faceValue: product?.faceValue?.toString() ?? '',
    sellingPrice: product?.sellingPrice?.toString() ?? '',
    stock: product?.stock?.toString() ?? '',
    expiryDays: product?.expiryDays?.toString() ?? '365',
    refundPolicy: '7days',
    usageLocations: ['전국 매장', '온라인 주문'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLocation, setNewLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-sm mb-4">상품을 찾을 수 없습니다.</p>
        <Link
          href="/products"
          className="text-[#7634CB] hover:underline text-sm"
        >
          상품 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const updateForm = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = '상품명을 입력하세요.';
    if (!form.brand.trim()) newErrors.brand = '브랜드를 입력하세요.';
    if (!form.category) newErrors.category = '카테고리를 선택하세요.';
    if (!form.faceValue || isNaN(Number(form.faceValue))) newErrors.faceValue = '올바른 액면가를 입력하세요.';
    if (!form.sellingPrice || isNaN(Number(form.sellingPrice))) newErrors.sellingPrice = '올바른 판매가를 입력하세요.';
    if (!form.stock || isNaN(Number(form.stock))) newErrors.stock = '올바른 재고 수량을 입력하세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    alert('상품이 저장되었습니다.');
    router.push('/products');
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">상품 수정</h2>
            <p className="text-sm text-gray-500">상품 정보를 수정합니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{product.id}</span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">기본 정보</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            상품명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm('name', e.target.value)}
            className={clsx(
              'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
              errors.name ? 'border-red-400' : 'border-gray-200'
            )}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              브랜드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => updateForm('brand', e.target.value)}
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
              <option value="">선택</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">상품 설명</label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all resize-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">정책 설정</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">액면가 (원) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.faceValue}
              onChange={(e) => updateForm('faceValue', e.target.value)}
              min="0"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                errors.faceValue ? 'border-red-400' : 'border-gray-200'
              )}
            />
            {errors.faceValue && <p className="text-xs text-red-500 mt-1">{errors.faceValue}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">판매가 (원) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.sellingPrice}
              onChange={(e) => updateForm('sellingPrice', e.target.value)}
              min="0"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                errors.sellingPrice ? 'border-red-400' : 'border-gray-200'
              )}
            />
            {errors.sellingPrice && <p className="text-xs text-red-500 mt-1">{errors.sellingPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">재고 수량 <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => updateForm('stock', e.target.value)}
              min="0"
              className={clsx(
                'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all',
                errors.stock ? 'border-red-400' : 'border-gray-200'
              )}
            />
            {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">유효기간 (일)</label>
            <input
              type="number"
              value={form.expiryDays}
              onChange={(e) => updateForm('expiryDays', e.target.value)}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all"
            />
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
          <div className="flex flex-wrap gap-2">
            {form.usageLocations.map((loc) => (
              <span key={loc} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-[#7634CB] rounded-full text-sm">
                {loc}
                <button onClick={() => handleRemoveLocation(loc)} className="text-[#7634CB]/60 hover:text-[#7634CB]">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Link
          href="/products"
          className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] disabled:opacity-60 transition-colors"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          저장하기
        </button>
      </div>
    </div>
  );
}
