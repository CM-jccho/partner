'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, Layers, Settings, DollarSign, Package, CheckCircle2, XCircle } from 'lucide-react';
import { channels, formatCurrency, formatNumber } from '@/data/mock';
import { clsx } from 'clsx';

const availableChannels = [
  { id: 'ch-001', name: '폰기프트몰', description: '자사 모바일 상품권 판매몰', color: 'bg-purple-500', type: '자사 Mall' },
  { id: 'ch-002', name: '카카오선물하기', description: '카카오톡 선물하기 플랫폼', color: 'bg-yellow-400', type: '외부 플랫폼' },
  { id: 'ch-003', name: '네이버 쇼핑', description: '네이버 스마트스토어 연동', color: 'bg-green-500', type: '외부 플랫폼' },
  { id: 'ch-004', name: '쿠팡', description: '쿠팡 로켓배송 플랫폼', color: 'bg-blue-500', type: '외부 플랫폼' },
  { id: 'ch-005', name: '11번가', description: '11번가 오픈마켓 플랫폼', color: 'bg-red-500', type: '외부 플랫폼' },
  { id: 'ch-006', name: 'G마켓', description: 'G마켓 오픈마켓 플랫폼', color: 'bg-emerald-500', type: '외부 플랫폼' },
  { id: 'ch-007', name: '위메프', description: '위메프 소셜커머스 플랫폼', color: 'bg-rose-500', type: '외부 플랫폼' },
];

export default function ChannelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [localChannels, setLocalChannels] = useState(channels);

  const getChannelInitial = (name: string) => name[0];

  const channelColorMap: Record<string, string> = availableChannels.reduce((acc, ch) => {
    acc[ch.id] = ch.color;
    return acc;
  }, {} as Record<string, string>);

  const handleConnectChannel = () => {
    if (!selectedChannel) return;

    const newChannelInfo = availableChannels.find((c) => c.id === selectedChannel);
    if (newChannelInfo) {
      const newChannel = {
        id: newChannelInfo.id,
        name: newChannelInfo.name,
        type: newChannelInfo.type,
        status: "ACTIVE" as const,
        registeredProducts: 0,
        monthlySales: 0,
      };

      setLocalChannels([...localChannels, newChannel]);
      alert(`${newChannel.name} 채널이 연동되었습니다.`);
    }

    setIsModalOpen(false);
    setSelectedChannel(null);
  };

  const handleFeatureInPreparation = () => {
    alert("준비 중인 기능입니다.");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">채널 목록</h2>
          <p className="text-sm text-gray-500 mt-0.5">총 {localChannels.length}개의 채널이 연동되어 있습니다.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors shadow-sm"
        >
          <Plus size={18} />
          채널 연동하기
        </button>
      </div>

      {/* Channel Cards Grid */}
      {localChannels.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 flex flex-col items-center text-gray-400">
          <Layers size={48} className="mb-3 opacity-30" />
          <p className="text-sm">연동된 채널이 없습니다.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-sm text-[#7634CB] hover:underline"
          >
            채널 연동하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {localChannels.map((channel) => (
            <div
              key={channel.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#7634CB]/20 transition-all"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold',
                      channelColorMap[channel.id] ?? 'bg-gray-400'
                    )}
                  >
                    {getChannelInitial(channel.name)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{channel.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{channel.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {channel.status === 'ACTIVE' ? (
                    <>
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-xs font-medium text-green-600">연동됨</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">미연동</span>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">등록 상품</div>
                  <div className="text-base font-bold text-gray-900">{channel.registeredProducts}개</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">이번달 매출</div>
                  <div className="text-base font-bold text-gray-900">
                    {channel.monthlySales > 0 ? (channel.monthlySales / 1000000).toFixed(1) + '백만' : '0'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/channels/${channel.id}/products`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Package size={14} />
                  상품 설정
                </Link>
                <button
                  onClick={handleFeatureInPreparation}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <DollarSign size={14} />
                  가격 설정
                </button>
                <button
                  onClick={handleFeatureInPreparation}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Channel Connect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">채널 연동하기</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-gray-500 mb-4">연동할 판매 채널을 선택하세요.</p>
              {availableChannels.map((ch) => {
                const isConnected = localChannels.some((c) => c.id === ch.id);
                return (
                  <label
                    key={ch.id}
                    className={clsx(
                      'flex items-center gap-4 p-4 border rounded-xl transition-all',
                      isConnected ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' : 'cursor-pointer',
                      selectedChannel === ch.id && !isConnected
                        ? 'border-[#7634CB] bg-purple-50'
                        : (!isConnected ? 'border-gray-100 hover:border-gray-200 hover:bg-gray-50' : '')
                    )}
                  >
                    <input
                      type="radio"
                      name="channel"
                      value={ch.id}
                      checked={selectedChannel === ch.id}
                      onChange={() => !isConnected && setSelectedChannel(ch.id)}
                      disabled={isConnected}
                      className="text-[#7634CB] focus:ring-[#7634CB] disabled:opacity-50"
                    />
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm',
                        ch.color
                      )}
                    >
                      {ch.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        {ch.name}
                        {isConnected && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">연동됨</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{ch.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConnectChannel}
                disabled={!selectedChannel}
                className="flex-1 px-4 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] disabled:opacity-50 transition-colors"
              >
                연동하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
