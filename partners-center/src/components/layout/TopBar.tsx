'use client';

import { usePathname } from 'next/navigation';
import { Bell, Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const pageTitles: Record<string, { title: string; breadcrumb: string[] }> = {
  '/': { title: '대시보드', breadcrumb: ['홈', '대시보드'] },
  '/products': { title: '상품 목록', breadcrumb: ['홈', '상품 관리', '상품 목록'] },
  '/products/new': { title: '상품 등록', breadcrumb: ['홈', '상품 관리', '상품 등록'] },
  '/products/policy': { title: '상품 정책', breadcrumb: ['홈', '상품 관리', '상품 정책'] },
  '/channels': { title: '채널 목록', breadcrumb: ['홈', '채널 관리', '채널 목록'] },
  '/orders': { title: '주문 목록', breadcrumb: ['홈', '주문 관리', '주문 목록'] },
  '/vouchers': { title: '상품권 목록', breadcrumb: ['홈', '상품권 관리', '상품권 목록'] },
  '/settlement': { title: '정산 대시보드', breadcrumb: ['홈', '정산 관리', '정산 대시보드'] },
  '/settlement/ledger': { title: '정산 원장', breadcrumb: ['홈', '정산 관리', '정산 원장'] },
  '/reports': { title: '판매 리포트', breadcrumb: ['홈', '리포트', '판매 리포트'] },
  '/settings/users': { title: '사용자 관리', breadcrumb: ['홈', '설정', '사용자 관리'] },
  '/settings/api': { title: 'API 키 관리', breadcrumb: ['홈', '설정', 'API 키'] },
};

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasNotifications] = useState(true);

  const getPageInfo = () => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    // Handle dynamic routes
    if (pathname.startsWith('/products/') && pathname.endsWith('/edit')) {
      return { title: '상품 수정', breadcrumb: ['홈', '상품 관리', '상품 수정'] };
    }
    if (pathname.startsWith('/orders/')) {
      return { title: '주문 상세', breadcrumb: ['홈', '주문 관리', '주문 상세'] };
    }
    if (pathname.startsWith('/channels/')) {
      return { title: '채널 상품 설정', breadcrumb: ['홈', '채널 관리', '상품 설정'] };
    }
    return { title: '페이지', breadcrumb: ['홈'] };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <nav className="flex items-center gap-1 mt-0.5">
            {breadcrumb.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-gray-300 text-xs">/</span>}
                <span
                  className={clsx(
                    'text-xs',
                    idx === breadcrumb.length - 1
                      ? 'text-[#7634CB] font-medium'
                      : 'text-gray-400'
                  )}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-[#7634CB] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              김
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-800">김담당</div>
              <div className="text-xs text-gray-500">관리자</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-800">김담당</div>
                  <div className="text-xs text-gray-500">admin@techstart.co.kr</div>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={16} />
                  내 프로필
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={16} />
                  설정
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
