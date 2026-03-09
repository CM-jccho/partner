'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { auditLogs } from '@/data/mock';
import { formatDateTime } from '@/lib/utils';
import { clsx } from 'clsx';

const ACTION_CONFIG: Record<string, { label: string; color: string }> = {
  PARTNER_APPROVED: { label: '파트너 승인', color: 'bg-emerald-100 text-emerald-700' },
  PARTNER_REJECTED: { label: '파트너 거절', color: 'bg-red-100 text-red-700' },
  PRODUCT_APPROVED: { label: '상품 승인', color: 'bg-blue-100 text-blue-700' },
  PRODUCT_REJECTED: { label: '상품 반려', color: 'bg-red-100 text-red-700' },
  ORDER_CANCELED: { label: '주문 취소', color: 'bg-orange-100 text-orange-700' },
  SETTLEMENT_CLOSED: { label: '정산 마감', color: 'bg-purple-100 text-purple-700' },
  COMMISSION_UPDATED: { label: '수수료 변경', color: 'bg-yellow-100 text-yellow-700' },
  ADMIN_CREATED: { label: '관리자 생성', color: 'bg-indigo-100 text-indigo-700' },
};

const TARGET_LABELS: Record<string, string> = {
  PARTNER: '파트너',
  PRODUCT: '상품',
  ORDER: '주문',
  SETTLEMENT: '정산',
  ADMIN: '관리자',
};

export default function AuditPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        search === '' ||
        log.targetName.includes(search) ||
        log.adminName.includes(search) ||
        log.action.includes(search);
      const matchAction = actionFilter === '' || log.action === actionFilter;
      const matchAdmin = adminFilter === '' || log.adminId === adminFilter;
      return matchSearch && matchAction && matchAdmin;
    });
  }, [search, actionFilter, adminFilter]);

  const seenAdmins = new Map<string, { id: string; name: string }>();
  auditLogs.forEach((l) => { if (!seenAdmins.has(l.adminId)) seenAdmins.set(l.adminId, { id: l.adminId, name: l.adminName }); });
  const uniqueAdmins = [...seenAdmins.values()];

  const uniqueActions = [...new Set(auditLogs.map((l) => l.action))];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">감사 로그</h2>
        <p className="text-sm text-gray-500 mt-0.5">관리자의 모든 주요 작업 이력을 기록합니다.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '전체 기록', value: auditLogs.length },
          { label: '파트너 관련', value: auditLogs.filter((l) => l.targetType === 'PARTNER').length },
          { label: '상품 관련', value: auditLogs.filter((l) => l.targetType === 'PRODUCT').length },
          { label: '오늘 작업', value: auditLogs.filter((l) => l.timestamp.startsWith('2026-03-05')).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="관리자명, 대상명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="">전체 작업</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{ACTION_CONFIG[a]?.label ?? a}</option>
          ))}
        </select>
        <select
          value={adminFilter}
          onChange={(e) => setAdminFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="">전체 관리자</option>
          {uniqueAdmins.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">작업 이력 ({filtered.length}건)</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((log) => {
            const actionCfg = ACTION_CONFIG[log.action] ?? { label: log.action, color: 'bg-gray-100 text-gray-600' };
            const isExpanded = expanded === log.id;

            return (
              <div key={log.id} className="px-6 py-4">
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : log.id)}
                >
                  {/* Left: timeline dot */}
                  <div className="shrink-0 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#004399] ring-4 ring-blue-50" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', actionCfg.color)}>
                        {actionCfg.label}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {TARGET_LABELS[log.targetType] ?? log.targetType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mt-1.5">
                      <span className="font-medium text-[#004399]">{log.adminName}</span>
                      {' 관리자가 '}
                      <span className="font-medium">{log.targetName}</span>
                      {' 을(를) '}
                      <span className="font-medium">{actionCfg.label}</span>
                      {' 처리했습니다.'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{formatDateTime(log.timestamp)}</span>
                      <span className="text-xs text-gray-400 font-mono">IP: {log.ipAddress}</span>
                    </div>
                  </div>

                  {/* Expand toggle */}
                  <button className="p-1 text-gray-400 hover:text-gray-600 shrink-0">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Expanded: before/after diff */}
                {isExpanded && (
                  <div className="mt-3 ml-6 grid grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-red-600 mb-1.5">변경 전 (Before)</p>
                      {log.before ? (
                        <pre className="text-xs text-red-700 font-mono whitespace-pre-wrap">
                          {JSON.stringify(log.before, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-xs text-gray-400 italic">신규 생성</p>
                      )}
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-green-600 mb-1.5">변경 후 (After)</p>
                      {log.after ? (
                        <pre className="text-xs text-green-700 font-mono whitespace-pre-wrap">
                          {JSON.stringify(log.after, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-xs text-gray-400 italic">삭제됨</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
