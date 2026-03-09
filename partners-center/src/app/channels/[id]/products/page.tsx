'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { channels, products, formatCurrency } from '@/data/mock';
import { clsx } from 'clsx';

interface ProductChannelConfig {
  productId: string;
  enabled: boolean;
  channelPrice: string;
  stockAllocation: string;
}

export default function ChannelProductsPage() {
  const params = useParams();
  const channelId = params.id as string;

  const channel = channels.find((c) => c.id === channelId);

  const [configs, setConfigs] = useState<Record<string, ProductChannelConfig>>(
    Object.fromEntries(
      products.map((p) => [
        p.id,
        {
          productId: p.id,
          enabled: p.status === 'ACTIVE' && Math.random() > 0.4,
          channelPrice: p.sellingPrice.toString(),
          stockAllocation: Math.floor(p.stock * 0.3).toString(),
        },
      ])
    )
  );

  const [isSaving, setIsSaving] = useState(false);

  const activeProducts = products.filter((p) => p.status === 'ACTIVE' || p.status === 'APPROVED');

  const toggleProduct = (productId: string) => {
    setConfigs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], enabled: !prev[productId].enabled },
    }));
  };

  const updateConfig = (productId: string, field: 'channelPrice' | 'stockAllocation', value: string) => {
    setConfigs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    alert('채널 상품 설정이 저장되었습니다.');
  };

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-sm mb-4">채널을 찾을 수 없습니다.</p>
        <Link href="/channels" className="text-[#7634CB] hover:underline text-sm">
          채널 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const enabledCount = Object.values(configs).filter((c) => c.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/channels"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{channel.name} 상품 설정</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {enabledCount}개 상품 판매 활성화 / 전체 {activeProducts.length}개
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] disabled:opacity-60 transition-colors"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          저장하기
        </button>
      </div>

      {/* Channel Info Banner */}
      <div className="bg-[#7634CB]/5 border border-[#7634CB]/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#7634CB] rounded-xl flex items-center justify-center text-white font-bold">
          {channel.name[0]}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{channel.name}</div>
          <div className="text-xs text-gray-500">{channel.type} · {channel.status === 'ACTIVE' ? '연동 중' : '미연동'}</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">활성화</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">기본 판매가</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">채널 전용 가격</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">재고 배분</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Package size={40} className="mb-2 opacity-30" />
                      <p className="text-sm">등록 가능한 상품이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activeProducts.map((product) => {
                  const config = configs[product.id];
                  return (
                    <tr
                      key={product.id}
                      className={clsx(
                        'transition-colors',
                        config?.enabled ? 'hover:bg-purple-50/20' : 'hover:bg-gray-50/50 opacity-60'
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <div
                          onClick={() => toggleProduct(product.id)}
                          className={clsx(
                            'relative w-11 h-6 rounded-full transition-colors cursor-pointer',
                            config?.enabled ? 'bg-[#7634CB]' : 'bg-gray-200'
                          )}
                        >
                          <div
                            className={clsx(
                              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                              config?.enabled ? 'translate-x-5' : 'translate-x-0'
                            )}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{product.brand} · {product.category}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm text-gray-600">{formatCurrency(product.sellingPrice)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={config?.channelPrice ?? ''}
                            onChange={(e) => updateConfig(product.id, 'channelPrice', e.target.value)}
                            disabled={!config?.enabled}
                            placeholder="판매가"
                            className="w-32 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            value={config?.stockAllocation ?? ''}
                            onChange={(e) => updateConfig(product.id, 'stockAllocation', e.target.value)}
                            disabled={!config?.enabled}
                            placeholder="수량"
                            className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#7634CB]/20 focus:border-[#7634CB] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                          />
                          <span className="text-xs text-gray-400">/ {product.stock}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
