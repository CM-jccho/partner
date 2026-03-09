'use client';

import { useState } from 'react';
import { Key, Copy, RefreshCw, Eye, EyeOff, Plus, Trash2, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  status: 'ACTIVE' | 'REVOKED';
}

const initialKeys: ApiKey[] = [
  {
    id: 'key001',
    name: '프로덕션 API 키',
    key: 'pk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    prefix: 'pk_live_',
    createdAt: '2024-01-15',
    lastUsedAt: '2026-03-05',
    expiresAt: '2027-01-15',
    status: 'ACTIVE',
  },
  {
    id: 'key002',
    name: '테스트 API 키',
    key: 'pk_test_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4',
    prefix: 'pk_test_',
    createdAt: '2024-02-01',
    lastUsedAt: '2026-02-28',
    expiresAt: null,
    status: 'ACTIVE',
  },
  {
    id: 'key003',
    name: '구버전 키 (만료)',
    key: 'pk_live_old1234567890abcdefghijklmnopqrs',
    prefix: 'pk_live_',
    createdAt: '2023-06-01',
    lastUsedAt: '2023-12-31',
    expiresAt: '2024-01-01',
    status: 'REVOKED',
  },
];

const WEBHOOK_EVENTS = [
  { id: 'order.completed', label: '주문 완료', checked: true },
  { id: 'order.canceled', label: '주문 취소', checked: true },
  { id: 'voucher.issued', label: '상품권 발급', checked: false },
  { id: 'voucher.used', label: '상품권 사용', checked: true },
  { id: 'settlement.completed', label: '정산 완료', checked: false },
];

function maskKey(key: string): string {
  return key.slice(0, 12) + '••••••••••••••••••••' + key.slice(-4);
}

export default function ApiSettingsPage() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourcompany.com/webhooks/pongift');
  const [webhookEvents, setWebhookEvents] = useState(WEBHOOK_EVENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'live' | 'test'>('live');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  const toggleVisible = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const revokeKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'REVOKED' } : k))
    );
  };

  const createKey = () => {
    const rawKey = `pk_${newKeyType}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const newKey: ApiKey = {
      id: `key${Date.now()}`,
      name: newKeyName || '새 API 키',
      key: rawKey,
      prefix: `pk_${newKeyType}_`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsedAt: null,
      expiresAt: null,
      status: 'ACTIVE',
    };
    setKeys((prev) => [newKey, ...prev]);
    setCreatedKey(rawKey);
    setNewKeyName('');
  };

  const saveWebhook = () => {
    setSavedMsg('Webhook 설정이 저장되었습니다.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const toggleEvent = (id: string) => {
    setWebhookEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e))
    );
  };

  const activeKeys = keys.filter((k) => k.status === 'ACTIVE');
  const revokedKeys = keys.filter((k) => k.status === 'REVOKED');

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">API 키 관리</h2>
        <p className="text-sm text-gray-500 mt-0.5">API 키를 생성하고 Webhook을 설정합니다.</p>
      </div>

      {savedMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {savedMsg}
        </div>
      )}

      {/* Active Keys */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-[#7634CB]" />
            <h3 className="font-semibold text-gray-800">활성 API 키 ({activeKeys.length})</h3>
          </div>
          <button
            onClick={() => { setShowCreateModal(true); setCreatedKey(null); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7634CB] text-white rounded-lg text-xs font-medium hover:bg-[#5A2799] transition-colors"
          >
            <Plus size={13} />
            새 키 생성
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {activeKeys.map((k) => {
            const isVisible = visibleKeys.has(k.id);
            const isCopied = copiedKey === k.id;
            return (
              <div key={k.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{k.name}</span>
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        k.prefix.includes('test') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      )}>
                        {k.prefix.includes('test') ? 'Test' : 'Live'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs font-mono bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-700 flex-1 truncate">
                        {isVisible ? k.key : maskKey(k.key)}
                      </code>
                      <button
                        onClick={() => toggleVisible(k.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyKey(k.id, k.key)}
                        className="p-1.5 text-gray-400 hover:text-[#7634CB] hover:bg-purple-50 rounded transition-colors"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">생성: {k.createdAt}</span>
                      <span className="text-xs text-gray-400">마지막 사용: {k.lastUsedAt ?? '없음'}</span>
                      {k.expiresAt && <span className="text-xs text-amber-600">만료: {k.expiresAt}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => revokeKey(k.id)}
                    className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revoked Keys */}
      {revokedKeys.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-500 text-sm">폐기된 키 ({revokedKeys.length})</h3>
          </div>
          <div className="divide-y divide-gray-50 opacity-60">
            {revokedKeys.map((k) => (
              <div key={k.id} className="px-6 py-3 flex items-center gap-3">
                <code className="text-xs font-mono text-gray-400 flex-1 truncate">{maskKey(k.key)}</code>
                <span className="text-xs text-gray-400">{k.name}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">폐기됨</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhook Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Webhook 설정</h3>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Webhook URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7634CB]"
              placeholder="https://yoursite.com/webhook"
            />
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <RefreshCw size={13} />
              테스트
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">수신할 이벤트</label>
          <div className="space-y-2">
            {webhookEvents.map((event) => (
              <label key={event.id} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={event.checked}
                  onChange={() => toggleEvent(event.id)}
                  className="w-4 h-4 accent-[#7634CB]"
                />
                <span className="text-sm text-gray-700">{event.label}</span>
                <code className="text-xs text-gray-400 font-mono">{event.id}</code>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={saveWebhook}
          className="w-full py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors"
        >
          Webhook 설정 저장
        </button>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            {createdKey ? (
              <>
                <h3 className="text-lg font-bold text-gray-900">API 키가 생성되었습니다</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-700 mb-2 font-medium">
                    이 키는 다시 표시되지 않습니다. 지금 복사해 두세요.
                  </p>
                  <code className="text-xs font-mono text-gray-800 break-all">{createdKey}</code>
                </div>
                <button
                  onClick={() => copyKey('new', createdKey)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799]"
                >
                  <Copy size={14} />
                  복사하기
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  닫기
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900">새 API 키 생성</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">키 이름</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7634CB]"
                      placeholder="예: 모바일 앱 키"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">환경</label>
                    <div className="flex gap-2">
                      {(['live', 'test'] as const).map((env) => (
                        <button
                          key={env}
                          onClick={() => setNewKeyType(env)}
                          className={clsx(
                            'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                            newKeyType === env
                              ? 'bg-[#7634CB] text-white border-[#7634CB]'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          {env === 'live' ? 'Live (프로덕션)' : 'Test (테스트)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={createKey}
                    className="flex-1 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799]"
                  >
                    생성
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
