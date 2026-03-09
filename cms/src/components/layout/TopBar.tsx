'use client';

import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeMap: Record<string, { breadcrumb: BreadcrumbItem[]; title: string }> = {
  '/': { breadcrumb: [{ label: '대시보드' }], title: '플랫폼 대시보드' },
  '/partners': { breadcrumb: [{ label: '파트너 관리' }, { label: '파트너 목록' }], title: '파트너 목록' },
  '/partners/pending': { breadcrumb: [{ label: '파트너 관리' }, { label: '파트너 승인' }], title: '파트너 승인 대기' },
  '/products': { breadcrumb: [{ label: '상품 관리' }, { label: '상품 목록' }], title: '상품 목록' },
  '/products/pending': { breadcrumb: [{ label: '상품 관리' }, { label: '상품 승인' }], title: '상품 승인 대기' },
  '/orders': { breadcrumb: [{ label: '주문 관리' }, { label: '주문 목록' }], title: '주문 목록' },
  '/vouchers': { breadcrumb: [{ label: '상품권 관리' }, { label: '상품권 목록' }], title: '상품권 목록' },
  '/settlement': { breadcrumb: [{ label: '정산 관리' }, { label: '정산 대시보드' }], title: '정산 대시보드' },
  '/settlement/ledger': { breadcrumb: [{ label: '정산 관리' }, { label: '정산 원장' }], title: '정산 원장' },
  '/settlement/commission': { breadcrumb: [{ label: '정산 관리' }, { label: '수수료 관리' }], title: '수수료 관리' },
  '/content/banners': { breadcrumb: [{ label: '운영 관리' }, { label: '배너 관리' }], title: '배너 관리' },
  '/content/notices': { breadcrumb: [{ label: '운영 관리' }, { label: '공지사항' }], title: '공지사항' },
  '/system/admins': { breadcrumb: [{ label: '시스템 관리' }, { label: '관리자 계정' }], title: '관리자 계정' },
  '/system/roles': { breadcrumb: [{ label: '시스템 관리' }, { label: '권한 관리' }], title: '권한 관리' },
  '/system/api': { breadcrumb: [{ label: '시스템 관리' }, { label: 'API 관리' }], title: 'API 관리' },
  '/system/webhooks': { breadcrumb: [{ label: '시스템 관리' }, { label: 'Webhook' }], title: 'Webhook 관리' },
  '/system/logs': { breadcrumb: [{ label: '시스템 관리' }, { label: '시스템 로그' }], title: '시스템 로그' },
  '/system/audit': { breadcrumb: [{ label: '시스템 관리' }, { label: '감사 로그' }], title: '감사 로그' },
};

export default function TopBar() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  // Find matching route (handle dynamic routes like /partners/[id])
  const getRouteInfo = () => {
    if (routeMap[pathname]) return routeMap[pathname];

    // Handle dynamic routes
    if (pathname.startsWith('/partners/') && pathname !== '/partners/pending') {
      return { breadcrumb: [{ label: '파트너 관리' }, { label: '파트너 목록', href: '/partners' }, { label: '파트너 상세' }], title: '파트너 상세' };
    }
    if (pathname.startsWith('/orders/')) {
      return { breadcrumb: [{ label: '주문 관리' }, { label: '주문 목록', href: '/orders' }, { label: '주문 상세' }], title: '주문 상세' };
    }
    return { breadcrumb: [{ label: '대시보드' }], title: '대시보드' };
  };

  const routeInfo = getRouteInfo();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      {/* Left: Breadcrumb + Title */}
      <div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
          {routeInfo.breadcrumb.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight size={12} className="text-gray-400" />}
              <span>{item.label}</span>
            </span>
          ))}
        </div>
        <h1 className="text-base font-bold text-gray-900">{routeInfo.title}</h1>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 rounded-full bg-[#004399] flex items-center justify-center text-white text-sm font-bold">
              김
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">김운영</p>
              <p className="text-xs text-gray-500">슈퍼관리자</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                프로필 설정
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                비밀번호 변경
              </button>
              <hr className="my-1 border-gray-200" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
