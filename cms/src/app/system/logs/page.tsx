'use client';

import { useState, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import Badge, { logLevelBadge } from '@/components/ui/Badge';
import { systemLogs, LogLevel } from '@/data/mock';
import { formatDateTime } from '@/lib/utils';
import { clsx } from 'clsx';

const SERVICES = ['전체', 'payment-service', 'voucher-service', 'order-service', 'auth-service', 'settlement-service'];
const LEVELS: (LogLevel | '')[] = ['', 'ERROR', 'WARNING', 'INFO'];

export default function SystemLogsPage() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | ''>('');
  const [serviceFilter, setServiceFilter] = useState('전체');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return systemLogs.filter((log) => {
      const matchSearch = search === '' || log.message.includes(search) || log.id.includes(search);
      const matchLevel = levelFilter === '' || log.level === levelFilter;
      const matchService = serviceFilter === '전체' || log.service === serviceFilter;
      return matchSearch && matchLevel && matchService;
    });
  }, [search, levelFilter, serviceFilter]);

  const errorCount = systemLogs.filter((l) => l.level === 'ERROR').length;
  const warnCount = systemLogs.filter((l) => l.level === 'WARNING').length;
  const infoCount = systemLogs.filter((l) => l.level === 'INFO').length;

  const levelBg: Record<LogLevel, string> = {
    ERROR: 'border-l-4 border-red-400',
    WARNING: 'border-l-4 border-amber-400',
    INFO: 'border-l-4 border-blue-300',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">시스템 로그</h2>
          <p className="text-sm text-gray-500 mt-0.5">플랫폼 서비스 로그를 실시간으로 확인합니다.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <RefreshCw size={14} />
          새로고침
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '전체', value: systemLogs.length, color: 'text-gray-900' },
          { label: 'ERROR', value: errorCount, color: 'text-red-600' },
          { label: 'WARNING', value: warnCount, color: 'text-amber-600' },
          { label: 'INFO', value: infoCount, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={clsx('text-xl font-bold', s.color)}>{s.value}</p>
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
            placeholder="메시지 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as LogLevel | '')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="">전체 레벨</option>
          <option value="ERROR">ERROR</option>
          <option value="WARNING">WARNING</option>
          <option value="INFO">INFO</option>
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-900 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-400 font-mono">pongift-platform-logs</span>
        </div>
        <div className="bg-gray-950 min-h-64 max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">로그가 없습니다.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filtered.map((log) => {
                const badge = logLevelBadge(log.level);
                const isExpanded = expanded === log.id;
                let details: Record<string, unknown> = {};
                try { details = JSON.parse(log.details); } catch { /* noop */ }

                return (
                  <div
                    key={log.id}
                    className={clsx(
                      'px-4 py-3 cursor-pointer hover:bg-gray-900 transition-colors',
                      log.level === 'ERROR' && 'bg-red-950/30',
                      log.level === 'WARNING' && 'bg-amber-950/20',
                    )}
                    onClick={() => setExpanded(isExpanded ? null : log.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className={clsx(
                        'text-xs font-mono shrink-0 font-bold mt-0.5',
                        log.level === 'ERROR' ? 'text-red-400' :
                        log.level === 'WARNING' ? 'text-amber-400' : 'text-blue-400'
                      )}>
                        [{log.level.padEnd(7)}]
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500 font-mono shrink-0">
                            {formatDateTime(log.timestamp)}
                          </span>
                          <span className="text-xs text-cyan-400 font-mono shrink-0">{log.service}</span>
                        </div>
                        <p className="text-sm text-gray-200 mt-0.5">{log.message}</p>
                        {isExpanded && (
                          <div className="mt-2 bg-gray-800 rounded p-3">
                            <p className="text-xs text-gray-400 mb-2 font-mono">details:</p>
                            <pre className="text-xs text-green-300 font-mono overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">클릭하면 상세 정보를 확인할 수 있습니다.</p>
    </div>
  );
}
