import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number): string {
  if (amount >= 100000000) return `₩${(amount / 100000000).toFixed(1)}억`;
  if (amount >= 10000) return `₩${(amount / 10000).toFixed(0)}만`;
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ko-KR");
}
