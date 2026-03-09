'use client';

import { useState } from 'react';
import { Plus, Image as ImageIcon, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { banners as initialBanners, Banner } from '@/data/mock';
import { formatDate } from '@/lib/utils';
import { clsx } from 'clsx';

const POSITION_LABELS: Record<string, string> = {
  MAIN: '메인 배너',
  CATEGORY: '카테고리 배너',
};

export default function BannersPage() {
  const [data, setData] = useState<Banner[]>(initialBanners);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'MAIN' | 'CATEGORY'>('ALL');

  const filtered = positionFilter === 'ALL' ? data : data.filter((b) => b.position === positionFilter);

  const toggleStatus = (id: string) => {
    setData((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : b
      )
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    setSuccessMsg('배너가 삭제되었습니다.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const movePriority = (id: string, dir: 'up' | 'down') => {
    const idx = data.findIndex((b) => b.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === data.length - 1)) return;
    const newData = [...data];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    [newData[idx], newData[swapIdx]] = [newData[swapIdx], newData[idx]];
    setData(newData);
  };

  const activeCount = data.filter((b) => b.status === 'ACTIVE').length;
  const mainCount = data.filter((b) => b.position === 'MAIN').length;
  const categoryCount = data.filter((b) => b.position === 'CATEGORY').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">배너 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">쇼핑몰 배너 콘텐츠를 등록하고 관리합니다.</p>
        </div>
        <Button variant="primary">
          <Plus size={16} />
          배너 추가
        </Button>
      </div>

      {successMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '전체 배너', value: data.length },
          { label: '활성', value: activeCount },
          { label: '메인 배너', value: mainCount },
          { label: '카테고리 배너', value: categoryCount },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'MAIN', 'CATEGORY'] as const).map((pos) => (
          <button
            key={pos}
            onClick={() => setPositionFilter(pos)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              positionFilter === pos
                ? 'bg-[#004399] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {pos === 'ALL' ? '전체' : POSITION_LABELS[pos]}
          </button>
        ))}
      </div>

      {/* Banner Cards */}
      <div className="space-y-4">
        {filtered.map((banner) => (
          <div
            key={banner.id}
            className={clsx(
              'bg-white rounded-2xl border shadow-sm overflow-hidden',
              banner.status === 'ACTIVE' ? 'border-gray-100' : 'border-gray-200 opacity-70'
            )}
          >
            <div className="flex items-stretch gap-0">
              {/* Preview */}
              <div className="w-48 shrink-0 bg-gray-100 flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: 100 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <ImageIcon size={24} className="text-gray-300 absolute" />
              </div>

              {/* Info */}
              <div className="flex-1 p-5 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={banner.status === 'ACTIVE' ? 'success' : 'gray'}>
                      {banner.status === 'ACTIVE' ? '활성' : '비활성'}
                    </Badge>
                    <Badge variant="blue">{POSITION_LABELS[banner.position]}</Badge>
                    <span className="text-xs text-gray-400">우선순위 {banner.priority}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm truncate">{banner.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(banner.startDate)} ~ {formatDate(banner.endDate)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{banner.linkUrl}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePriority(banner.id, 'up')}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => movePriority(banner.id, 'down')}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleStatus(banner.id)}
                    className={clsx(
                      'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
                      banner.status === 'ACTIVE'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    )}
                  >
                    {banner.status === 'ACTIVE' ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => setEditTarget(banner)}
                    className="p-2 text-gray-400 hover:text-[#004399] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(banner)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="배너 삭제"
        message={`"${deleteTarget?.title}" 배너를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        confirmVariant="danger"
      />
    </div>
  );
}
