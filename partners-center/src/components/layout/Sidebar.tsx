'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FileText,
  Layers,
  ShoppingCart,
  Gift,
  BarChart2,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Key,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { company } from '@/data/mock';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: '',
    items: [
      { label: '대시보드', href: '/', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: '상품 관리',
    items: [
      { label: '상품 목록', href: '/products', icon: <Package size={18} /> },
      { label: '상품 등록', href: '/products/new', icon: <PlusCircle size={18} /> },
      { label: '상품 정책', href: '/products/policy', icon: <FileText size={18} /> },
    ],
  },
  {
    title: '채널 관리',
    items: [
      { label: '채널 목록', href: '/channels', icon: <Layers size={18} /> },
    ],
  },
  {
    title: '주문 관리',
    items: [
      { label: '주문 목록', href: '/orders', icon: <ShoppingCart size={18} /> },
    ],
  },
  {
    title: '상품권 관리',
    items: [
      { label: '상품권 목록', href: '/vouchers', icon: <Gift size={18} /> },
    ],
  },
  {
    title: '정산 관리',
    items: [
      { label: '정산 대시보드', href: '/settlement', icon: <BarChart2 size={18} /> },
      { label: '정산 원장', href: '/settlement/ledger', icon: <FileSpreadsheet size={18} /> },
    ],
  },
  {
    title: '리포트',
    items: [
      { label: '판매 리포트', href: '/reports', icon: <TrendingUp size={18} /> },
    ],
  },
  {
    title: '설정',
    items: [
      { label: '사용자 관리', href: '/settings/users', icon: <Users size={18} /> },
      { label: 'API 키', href: '/settings/api', icon: <Key size={18} /> },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen w-64 bg-[#1E1040] flex flex-col z-30 transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <div className="text-white font-bold text-xl tracking-wider">PONGIFT</div>
            <div className="text-gray-400 text-xs mt-0.5">Partners</div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Company Name */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="text-xs text-gray-500 mb-0.5">파트너사</div>
          <div className="text-white text-sm font-medium truncate">{company.name}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-2">
              {section.title && (
                <div className="px-6 py-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </span>
                </div>
              )}
              <ul>
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.href && (
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 768) onClose();
                        }}
                        className={clsx(
                          'flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                          isActive(item.href)
                            ? 'bg-[#7634CB] text-white font-medium'
                            : 'text-gray-300 hover:bg-[#2D1A5E] hover:text-white'
                        )}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="text-xs text-gray-500">© 2026 PONGIFT</div>
          <div className="text-xs text-gray-600 mt-0.5">v0.1.0</div>
        </div>
      </aside>
    </>
  );
}
