import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'gray'
  | 'blue'
  | 'purple'
  | 'gold';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  blue: 'bg-blue-100 text-blue-700 border border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  gold: 'bg-amber-100 text-amber-700 border border-amber-200',
};

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function partnerStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    ACTIVE: { label: '활성', variant: 'success' },
    PENDING: { label: '승인대기', variant: 'warning' },
    SUSPENDED: { label: '정지', variant: 'danger' },
    REJECTED: { label: '거절', variant: 'gray' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function productStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    ACTIVE: { label: '활성', variant: 'success' },
    PENDING: { label: '승인대기', variant: 'warning' },
    INACTIVE: { label: '비활성', variant: 'gray' },
    REJECTED: { label: '반려', variant: 'danger' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function orderStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    COMPLETED: { label: '완료', variant: 'success' },
    PENDING: { label: '대기중', variant: 'warning' },
    PROCESSING: { label: '처리중', variant: 'info' },
    CANCELED: { label: '취소', variant: 'danger' },
    REFUNDED: { label: '환불', variant: 'gray' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function voucherStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    ACTIVE: { label: '활성', variant: 'success' },
    USED: { label: '사용됨', variant: 'info' },
    EXPIRED: { label: '만료', variant: 'gray' },
    CANCELED: { label: '취소', variant: 'danger' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function settlementStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    COMPLETED: { label: '완료', variant: 'success' },
    PROCESSING: { label: '처리중', variant: 'info' },
    PENDING: { label: '대기', variant: 'warning' },
    CLOSED: { label: '마감', variant: 'gray' },
  };
  return map[status] || { label: status, variant: 'gray' };
}

export function logLevelBadge(level: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    INFO: { label: 'INFO', variant: 'info' },
    WARNING: { label: 'WARNING', variant: 'warning' },
    ERROR: { label: 'ERROR', variant: 'danger' },
  };
  return map[level] || { label: level, variant: 'gray' };
}

export function adminRoleBadge(role: string) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    SUPER_ADMIN: { label: '슈퍼관리자', variant: 'blue' },
    ADMIN: { label: '관리자', variant: 'success' },
    VIEWER: { label: '뷰어', variant: 'gray' },
  };
  return map[role] || { label: role, variant: 'gray' };
}
