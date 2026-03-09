'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Badge, { adminRoleBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import { adminUsers as initialAdmins, AdminUser } from '@/data/mock';
import { formatDateTime } from '@/lib/utils';
import { clsx } from 'clsx';

const ROLE_LABELS = { SUPER_ADMIN: '슈퍼관리자', ADMIN: '관리자', VIEWER: '뷰어' };

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'VIEWER', department: '' });

  const filtered = admins.filter((a) => {
    const matchSearch = search === '' || a.name.includes(search) || a.email.includes(search);
    const matchRole = roleFilter === '' || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : a
      )
    );
    setDeactivateTarget(null);
    setSuccessMsg('관리자 상태가 변경되었습니다.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const changeRole = (id: string, role: string) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, role: role as AdminUser['role'] } : a))
    );
  };

  const handleInvite = () => {
    const newAdmin: AdminUser = {
      id: `a${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role as AdminUser['role'],
      department: inviteForm.department,
      lastLoginAt: new Date().toISOString(),
      status: 'ACTIVE',
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setShowInvite(false);
    setInviteForm({ name: '', email: '', role: 'VIEWER', department: '' });
    setSuccessMsg('관리자 초대가 완료되었습니다.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const activeCnt = admins.filter((a) => a.status === 'ACTIVE').length;
  const superCnt = admins.filter((a) => a.role === 'SUPER_ADMIN').length;
  const adminCnt = admins.filter((a) => a.role === 'ADMIN').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">관리자 계정 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">CMS 관리자 계정과 권한을 관리합니다.</p>
        </div>
        <Button variant="primary" onClick={() => setShowInvite(true)}>
          <Plus size={16} />
          관리자 초대
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
          { label: '전체 관리자', value: admins.length },
          { label: '활성', value: activeCnt },
          { label: '슈퍼관리자', value: superCnt },
          { label: '관리자', value: adminCnt },
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
            placeholder="이름, 이메일 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="">전체 역할</option>
          <option value="SUPER_ADMIN">슈퍼관리자</option>
          <option value="ADMIN">관리자</option>
          <option value="VIEWER">뷰어</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['이름', '이메일', '역할', '부서', '마지막 로그인', '상태', '액션'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((admin) => {
              const roleBadge = adminRoleBadge(admin.role);
              return (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{admin.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{admin.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={admin.role}
                      onChange={(e) => changeRole(admin.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1 bg-white outline-none"
                    >
                      <option value="SUPER_ADMIN">슈퍼관리자</option>
                      <option value="ADMIN">관리자</option>
                      <option value="VIEWER">뷰어</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{admin.department}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {formatDateTime(admin.lastLoginAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={admin.status === 'ACTIVE' ? 'success' : 'gray'}>
                      {admin.status === 'ACTIVE' ? '활성' : '비활성'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeactivateTarget(admin)}
                      className={clsx(
                        'text-xs px-2.5 py-1 rounded-lg font-medium transition-colors',
                        admin.status === 'ACTIVE'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      )}
                    >
                      {admin.status === 'ACTIVE' ? '비활성화' : '활성화'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">관리자 초대</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#004399]"
                  placeholder="이름 입력"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#004399]"
                  placeholder="이메일 입력"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">역할</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="ADMIN">관리자</option>
                  <option value="VIEWER">뷰어</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">부서</label>
                <input
                  type="text"
                  value={inviteForm.department}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, department: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#004399]"
                  placeholder="부서명 입력"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowInvite(false)}>취소</Button>
              <Button variant="primary" className="flex-1" onClick={handleInvite}>초대 발송</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => deactivateTarget && toggleStatus(deactivateTarget.id)}
        title={deactivateTarget?.status === 'ACTIVE' ? '관리자 비활성화' : '관리자 활성화'}
        message={`${deactivateTarget?.name} 관리자를 ${deactivateTarget?.status === 'ACTIVE' ? '비활성화' : '활성화'}하시겠습니까?`}
        confirmLabel={deactivateTarget?.status === 'ACTIVE' ? '비활성화' : '활성화'}
        confirmVariant={deactivateTarget?.status === 'ACTIVE' ? 'danger' : 'primary'}
      />
    </div>
  );
}
