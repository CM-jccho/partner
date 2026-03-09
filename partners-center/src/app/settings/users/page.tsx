'use client';

import { useState } from 'react';
import { UserPlus, Mail, Shield, Clock, MoreVertical, Check, X } from 'lucide-react';
import { users, type User, type UserRole, type UserStatus } from '@/data/mock';
import { clsx } from 'clsx';

const roleColors: Record<UserRole, string> = {
  '관리자': 'bg-purple-100 text-purple-700',
  '담당자': 'bg-blue-100 text-blue-700',
};

const statusColors: Record<UserStatus, string> = {
  'ACTIVE': 'bg-green-100 text-green-700',
  'INACTIVE': 'bg-gray-100 text-gray-500',
};

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>(users);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('담당자');
  const [successMsg, setSuccessMsg] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'ACTIVE',
      lastLogin: '-',
    };
    setUserList((prev) => [...prev, newUser]);
    setInviteEmail('');
    setInviteRole('담당자');
    setShowInviteModal(false);
    setSuccessMsg(`${newUser.email}님께 초대 메일을 발송했습니다.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeactivate = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : u
      )
    );
    setOpenMenuId(null);
  };

  const handleRoleChange = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === '관리자' ? '담당자' : '관리자' }
          : u
      )
    );
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">사용자 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">파트너센터 접근 계정을 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          사용자 초대
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <Check size={16} className="shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '전체 사용자', value: userList.length },
          { label: '활성', value: userList.filter((u) => u.status === 'ACTIVE').length },
          { label: '비활성', value: userList.filter((u) => u.status === 'INACTIVE').length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">사용자 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">이름</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">이메일</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">역할</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">상태</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">마지막 로그인</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7634CB] to-[#9B59B6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.name[0]}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Mail size={13} className="text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit', roleColors[user.role])}>
                      <Shield size={11} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', statusColors[user.status])}>
                      {user.status === 'ACTIVE' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Clock size={12} />
                      {user.lastLogin === '-' ? '-' : user.lastLogin.slice(0, 16)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === user.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[140px] overflow-hidden">
                          <button
                            onClick={() => handleRoleChange(user.id)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Shield size={14} />
                            역할 변경
                          </button>
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className={clsx(
                              'flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors',
                              user.status === 'ACTIVE' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                            )}
                          >
                            {user.status === 'ACTIVE' ? <X size={14} /> : <Check size={14} />}
                            {user.status === 'ACTIVE' ? '비활성화' : '활성화'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">사용자 초대</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 주소</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@company.co.kr"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">역할</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-white"
                >
                  <option value="관리자">관리자</option>
                  <option value="담당자">담당자</option>
                </select>
              </div>
              <p className="text-xs text-gray-400">초대 메일이 입력한 이메일로 발송됩니다.</p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleInvite}
                  className="flex-1 px-4 py-2.5 bg-[#7634CB] text-white rounded-xl text-sm font-medium hover:bg-[#5A2799] transition-colors"
                >
                  초대 발송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
