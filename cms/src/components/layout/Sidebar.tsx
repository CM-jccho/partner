'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Package,
  ShieldCheck,
  ShoppingCart,
  Gift,
  BarChart2,
  FileText,
  Percent,
  Image,
  Bell,
  UserCog,
  Shield,
  Code2,
  Webhook,
  Terminal,
  FileSearch,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '대시보드',
    items: [
      { label: '대시보드', href: '/', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: '파트너 관리',
    items: [
      { label: '파트너 목록', href: '/partners', icon: <Building2 size={16} /> },
      { label: '파트너 승인', href: '/partners/pending', icon: <CheckSquare size={16} /> },
    ],
  },
  {
    title: '상품 관리',
    items: [
      { label: '상품 목록', href: '/products', icon: <Package size={16} /> },
      { label: '상품 승인', href: '/products/pending', icon: <ShieldCheck size={16} /> },
    ],
  },
  {
    title: '주문 관리',
    items: [
      { label: '주문 목록', href: '/orders', icon: <ShoppingCart size={16} /> },
    ],
  },
  {
    title: '상품권 관리',
    items: [
      { label: '상품권 목록', href: '/vouchers', icon: <Gift size={16} /> },
    ],
  },
  {
    title: '정산 관리',
    items: [
      { label: '정산 대시보드', href: '/settlement', icon: <BarChart2 size={16} /> },
      { label: '정산 원장', href: '/settlement/ledger', icon: <FileText size={16} /> },
      { label: '수수료 관리', href: '/settlement/commission', icon: <Percent size={16} /> },
    ],
  },
  {
    title: '운영 관리',
    items: [
      { label: '배너 관리', href: '/content/banners', icon: <Image size={16} /> },
      { label: '공지사항', href: '/content/notices', icon: <Bell size={16} /> },
    ],
  },
  {
    title: '시스템 관리',
    items: [
      { label: '관리자 계정', href: '/system/admins', icon: <UserCog size={16} /> },
      { label: '권한 관리', href: '/system/roles', icon: <Shield size={16} /> },
      { label: 'API 관리', href: '/system/api', icon: <Code2 size={16} /> },
      { label: 'Webhook', href: '/system/webhooks', icon: <Webhook size={16} /> },
      { label: '시스템 로그', href: '/system/logs', icon: <Terminal size={16} /> },
      { label: '감사 로그', href: '/system/audit', icon: <FileSearch size={16} /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#001529] flex flex-col overflow-y-auto z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <span className="text-white font-bold text-lg tracking-tight">PONGIFT</span>
        <span className="bg-[#004399] text-white text-xs font-bold px-2 py-0.5 rounded">CMS</span>
      </div>

      {/* Admin Profile */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-[#004399] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          김
        </div>
        <div>
          <p className="text-white text-sm font-medium">김운영</p>
          <p className="text-white/50 text-xs">슈퍼관리자</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-2">
            <p className="px-6 py-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
              {group.title}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 mx-3 px-3 py-2 rounded text-sm transition-all',
                  isActive(item.href)
                    ? 'bg-[#004399] text-white font-medium'
                    : 'text-white/70 hover:bg-[#002855] hover:text-white'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs">v1.0.0 © 2026 PONGIFT</p>
      </div>
    </aside>
  );
}
