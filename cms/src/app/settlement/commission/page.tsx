'use client';

import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { partners, settlementData } from '@/data/mock';
import { formatKRW } from '@/lib/utils';
import { clsx } from 'clsx';

interface CommissionRow {
  partnerId: string;
  partnerName: string;
  category: string;
  currentRate: number;
  editRate: number;
  isEditing: boolean;
  monthlyRevenue: number;
}

const initialRows: CommissionRow[] = partners
  .filter((p) => p.status === 'ACTIVE')
  .map((p) => {
    const settlement = settlementData.find((s) => s.partnerId === p.id);
    return {
      partnerId: p.id,
      partnerName: p.name,
      category: p.category,
      currentRate: p.commissionRate,
      editRate: p.commissionRate,
      isEditing: false,
      monthlyRevenue: p.monthlyRevenue,
    };
  });

export default function CommissionPage() {
  const [rows, setRows] = useState<CommissionRow[]>(initialRows);
  const [savedMsg, setSavedMsg] = useState('');

  const startEdit = (partnerId: string) => {
    setRows((prev) =>
      prev.map((r) => (r.partnerId === partnerId ? { ...r, isEditing: true } : r))
    );
  };

  const cancelEdit = (partnerId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.partnerId === partnerId ? { ...r, isEditing: false, editRate: r.currentRate } : r
      )
    );
  };

  const saveEdit = (partnerId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.partnerId === partnerId
          ? { ...r, isEditing: false, currentRate: r.editRate }
          : r
      )
    );
    setSavedMsg('수수료율이 저장되었습니다.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const updateRate = (partnerId: string, value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0 || parsed > 30) return;
    setRows((prev) =>
      prev.map((r) => (r.partnerId === partnerId ? { ...r, editRate: parsed } : r))
    );
  };

  const categoryGroups = [...new Set(rows.map((r) => r.category))];
  const avgRate = rows.reduce((s, r) => s + r.currentRate, 0) / rows.length;
  const totalCommission = rows.reduce((s, r) => s + Math.round(r.monthlyRevenue * r.currentRate / 100), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">수수료 관리</h2>
        <p className="text-sm text-gray-500 mt-0.5">파트너별 수수료율을 설정하고 관리합니다.</p>
      </div>

      {savedMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {savedMsg}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '활성 파트너', value: `${rows.length}개사` },
          { label: '평균 수수료율', value: `${avgRate.toFixed(1)}%` },
          { label: '이번달 수수료 예상', value: formatKRW(totalCommission) },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Category sections */}
      {categoryGroups.map((category) => {
        const catRows = rows.filter((r) => r.category === category);
        return (
          <div key={category} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="text-xs bg-[#004399]/10 text-[#004399] px-2 py-0.5 rounded font-medium">{category}</span>
              <span className="text-sm text-gray-500">{catRows.length}개사</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['파트너', '월 매출', '현재 수수료율', '월 예상 수수료', '상태', '액션'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {catRows.map((row) => {
                  const expectedCommission = Math.round(row.monthlyRevenue * row.currentRate / 100);
                  return (
                    <tr key={row.partnerId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.partnerName}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatKRW(row.monthlyRevenue)}</td>
                      <td className="px-4 py-3">
                        {row.isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={30}
                              step={0.5}
                              value={row.editRate}
                              onChange={(e) => updateRate(row.partnerId, e.target.value)}
                              className="w-16 border border-[#004399] rounded px-2 py-1 text-sm text-center outline-none"
                            />
                            <span className="text-gray-500">%</span>
                          </div>
                        ) : (
                          <span className={clsx(
                            'font-semibold text-sm',
                            row.currentRate <= 4 ? 'text-emerald-600' : 'text-[#004399]'
                          )}>
                            {row.currentRate}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatKRW(expectedCommission)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">활성</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {row.isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => saveEdit(row.partnerId)}
                              className="p-1.5 text-[#004399] hover:bg-blue-50 rounded transition-colors"
                            >
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => cancelEdit(row.partnerId)}
                              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(row.partnerId)}
                            className="p-1.5 text-gray-400 hover:text-[#004399] hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
