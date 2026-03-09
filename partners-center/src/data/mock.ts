// Company Info
export const company = {
  id: "cp-001",
  name: "(주)테크스타트",
  businessNumber: "123-45-67890",
  ceoName: "김대표",
  email: "admin@techstart.co.kr",
  phone: "02-1234-5678",
  status: "ACTIVE",
};

// Types
export type ProductStatus = "DRAFT" | "PENDING" | "APPROVED" | "ACTIVE" | "INACTIVE";
export type OrderStatus = "CREATED" | "PAID" | "CANCEL_REQUESTED" | "CANCELED";
export type VoucherStatus = "ISSUED" | "DELIVERED" | "REDEEMED" | "EXPIRED";
export type SettlementStatus = "SETTLED" | "PENDING";
export type ChannelStatus = "ACTIVE" | "INACTIVE";
export type UserRole = "관리자" | "담당자";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  faceValue: number;
  sellingPrice: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  expiryDays: number;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  status: ChannelStatus;
  registeredProducts: number;
  monthlySales: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  channelId: string;
  channelName: string;
  quantity: number;
  amount: number;
  buyerName: string;
  recipientName: string;
  recipientPhone: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Voucher {
  id: string;
  voucherCode: string;
  orderId: string;
  productName: string;
  recipientName: string;
  recipientPhone: string;
  status: VoucherStatus;
  issuedAt: string;
  deliveredAt: string | null;
  redeemedAt: string | null;
  expiresAt: string;
  faceValue: number;
}

export interface SettlementMonth {
  month: string;
  totalSales: number;
  totalVouchers: number;
  commission: number;
  settlementAmount: number;
  status: SettlementStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

// Products
export const products: Product[] = [
  {
    id: "prod-001",
    name: "스타벅스 아메리카노 교환권",
    brand: "스타벅스",
    category: "카페/음료",
    faceValue: 5000,
    sellingPrice: 4800,
    stock: 500,
    status: "ACTIVE",
    createdAt: "2025-10-01",
    updatedAt: "2025-11-15",
    approvedAt: "2025-10-05",
    expiryDays: 365,
  },
  {
    id: "prod-002",
    name: "스타벅스 케이크 교환권",
    brand: "스타벅스",
    category: "카페/음료",
    faceValue: 8000,
    sellingPrice: 7500,
    stock: 200,
    status: "ACTIVE",
    createdAt: "2025-10-01",
    updatedAt: "2025-11-15",
    approvedAt: "2025-10-05",
    expiryDays: 180,
  },
  {
    id: "prod-003",
    name: "올리브영 1만원권",
    brand: "올리브영",
    category: "뷰티/헬스",
    faceValue: 10000,
    sellingPrice: 9500,
    stock: 1000,
    status: "ACTIVE",
    createdAt: "2025-10-10",
    updatedAt: "2025-11-20",
    approvedAt: "2025-10-15",
    expiryDays: 365,
  },
  {
    id: "prod-004",
    name: "배달의민족 2만원권",
    brand: "배달의민족",
    category: "외식/배달",
    faceValue: 20000,
    sellingPrice: 19000,
    stock: 300,
    status: "ACTIVE",
    createdAt: "2025-10-15",
    updatedAt: "2025-11-25",
    approvedAt: "2025-10-20",
    expiryDays: 365,
  },
  {
    id: "prod-005",
    name: "CGV 영화 관람권",
    brand: "CGV",
    category: "엔터테인먼트",
    faceValue: 15000,
    sellingPrice: 13000,
    stock: 400,
    status: "ACTIVE",
    createdAt: "2025-10-20",
    updatedAt: "2025-11-28",
    approvedAt: "2025-10-25",
    expiryDays: 365,
  },
  {
    id: "prod-006",
    name: "GS25 5천원권",
    brand: "GS25",
    category: "편의점",
    faceValue: 5000,
    sellingPrice: 4700,
    stock: 2000,
    status: "ACTIVE",
    createdAt: "2025-11-01",
    updatedAt: "2025-12-01",
    approvedAt: "2025-11-05",
    expiryDays: 365,
  },
  {
    id: "prod-007",
    name: "교보문고 도서상품권",
    brand: "교보문고",
    category: "도서/문구",
    faceValue: 10000,
    sellingPrice: 9800,
    stock: 800,
    status: "APPROVED",
    createdAt: "2025-11-05",
    updatedAt: "2025-12-05",
    approvedAt: "2025-11-10",
    expiryDays: 365,
  },
  {
    id: "prod-008",
    name: "이마트 5만원권",
    brand: "이마트",
    category: "마트/쇼핑",
    faceValue: 50000,
    sellingPrice: 48000,
    stock: 150,
    status: "ACTIVE",
    createdAt: "2025-11-10",
    updatedAt: "2025-12-10",
    approvedAt: "2025-11-15",
    expiryDays: 365,
  },
  {
    id: "prod-009",
    name: "메가커피 1천원권",
    brand: "메가커피",
    category: "카페/음료",
    faceValue: 1000,
    sellingPrice: 900,
    stock: 5000,
    status: "INACTIVE",
    createdAt: "2025-11-15",
    updatedAt: "2025-12-15",
    approvedAt: "2025-11-20",
    expiryDays: 90,
  },
  {
    id: "prod-010",
    name: "신세계백화점 10만원권",
    brand: "신세계백화점",
    category: "백화점/명품",
    faceValue: 100000,
    sellingPrice: 98000,
    stock: 50,
    status: "PENDING",
    createdAt: "2025-11-20",
    updatedAt: "2025-12-20",
    approvedAt: null,
    expiryDays: 365,
  },
  {
    id: "prod-011",
    name: "쿠팡이츠 1만원권",
    brand: "쿠팡이츠",
    category: "외식/배달",
    faceValue: 10000,
    sellingPrice: 9200,
    stock: 600,
    status: "ACTIVE",
    createdAt: "2025-11-25",
    updatedAt: "2025-12-25",
    approvedAt: "2025-11-30",
    expiryDays: 180,
  },
  {
    id: "prod-012",
    name: "투썸플레이스 아이스크림 교환권",
    brand: "투썸플레이스",
    category: "카페/음료",
    faceValue: 6000,
    sellingPrice: 5500,
    stock: 400,
    status: "ACTIVE",
    createdAt: "2025-12-01",
    updatedAt: "2026-01-01",
    approvedAt: "2025-12-05",
    expiryDays: 90,
  },
  {
    id: "prod-013",
    name: "빽다방 대용량 커피 교환권",
    brand: "빽다방",
    category: "카페/음료",
    faceValue: 5000,
    sellingPrice: 4500,
    stock: 700,
    status: "ACTIVE",
    createdAt: "2025-12-05",
    updatedAt: "2026-01-05",
    approvedAt: "2025-12-10",
    expiryDays: 90,
  },
  {
    id: "prod-014",
    name: "BBQ 치킨 교환권",
    brand: "BBQ",
    category: "외식/배달",
    faceValue: 22000,
    sellingPrice: 20000,
    stock: 100,
    status: "DRAFT",
    createdAt: "2025-12-10",
    updatedAt: "2026-01-10",
    approvedAt: null,
    expiryDays: 180,
  },
  {
    id: "prod-015",
    name: "롯데시네마 관람권",
    brand: "롯데시네마",
    category: "엔터테인먼트",
    faceValue: 14000,
    sellingPrice: 12500,
    stock: 350,
    status: "ACTIVE",
    createdAt: "2025-12-15",
    updatedAt: "2026-01-15",
    approvedAt: "2025-12-20",
    expiryDays: 365,
  },
];

// Channels
export const channels: Channel[] = [
  {
    id: "ch-001",
    name: "폰기프트몰",
    type: "자사 Mall",
    status: "ACTIVE",
    registeredProducts: 12,
    monthlySales: 52000000,
  },
  {
    id: "ch-002",
    name: "카카오선물하기",
    type: "외부 플랫폼",
    status: "ACTIVE",
    registeredProducts: 8,
    monthlySales: 38500000,
  },
  {
    id: "ch-003",
    name: "네이버 쇼핑",
    type: "외부 플랫폼",
    status: "ACTIVE",
    registeredProducts: 10,
    monthlySales: 27000000,
  },
  {
    id: "ch-004",
    name: "쿠팡",
    type: "외부 플랫폼",
    status: "ACTIVE",
    registeredProducts: 6,
    monthlySales: 15080000,
  },
  {
    id: "ch-005",
    name: "11번가",
    type: "외부 플랫폼",
    status: "ACTIVE",
    registeredProducts: 5,
    monthlySales: 10000000,
  },
];

// Orders
export const orders: Order[] = [
  { id: "ord-001", orderNumber: "ORD-20260101-0001", productId: "prod-001", productName: "스타벅스 아메리카노 교환권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 2, amount: 9600, buyerName: "이민준", recipientName: "박서연", recipientPhone: "010-1234-5678", status: "PAID", createdAt: "2026-01-01 10:23:00" },
  { id: "ord-002", orderNumber: "ORD-20260102-0001", productId: "prod-003", productName: "올리브영 1만원권", channelId: "ch-002", channelName: "카카오선물하기", quantity: 1, amount: 9500, buyerName: "김지수", recipientName: "최유진", recipientPhone: "010-2345-6789", status: "PAID", createdAt: "2026-01-02 14:10:00" },
  { id: "ord-003", orderNumber: "ORD-20260103-0001", productId: "prod-005", productName: "CGV 영화 관람권", channelId: "ch-003", channelName: "네이버 쇼핑", quantity: 3, amount: 39000, buyerName: "박준혁", recipientName: "이하나", recipientPhone: "010-3456-7890", status: "CANCEL_REQUESTED", createdAt: "2026-01-03 09:05:00" },
  { id: "ord-004", orderNumber: "ORD-20260104-0001", productId: "prod-008", productName: "이마트 5만원권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 1, amount: 48000, buyerName: "최현우", recipientName: "정다은", recipientPhone: "010-4567-8901", status: "PAID", createdAt: "2026-01-04 16:45:00" },
  { id: "ord-005", orderNumber: "ORD-20260105-0001", productId: "prod-004", productName: "배달의민족 2만원권", channelId: "ch-002", channelName: "카카오선물하기", quantity: 2, amount: 38000, buyerName: "정수민", recipientName: "강민서", recipientPhone: "010-5678-9012", status: "PAID", createdAt: "2026-01-05 11:30:00" },
  { id: "ord-006", orderNumber: "ORD-20260106-0001", productId: "prod-002", productName: "스타벅스 케이크 교환권", channelId: "ch-004", channelName: "쿠팡", quantity: 1, amount: 7500, buyerName: "한소희", recipientName: "윤지호", recipientPhone: "010-6789-0123", status: "CANCELED", createdAt: "2026-01-06 13:20:00" },
  { id: "ord-007", orderNumber: "ORD-20260107-0001", productId: "prod-006", productName: "GS25 5천원권", channelId: "ch-005", channelName: "11번가", quantity: 5, amount: 23500, buyerName: "임채원", recipientName: "오지원", recipientPhone: "010-7890-1234", status: "PAID", createdAt: "2026-01-07 08:15:00" },
  { id: "ord-008", orderNumber: "ORD-20260108-0001", productId: "prod-011", productName: "쿠팡이츠 1만원권", channelId: "ch-003", channelName: "네이버 쇼핑", quantity: 2, amount: 18400, buyerName: "송예진", recipientName: "류성민", recipientPhone: "010-8901-2345", status: "PAID", createdAt: "2026-01-08 17:00:00" },
  { id: "ord-009", orderNumber: "ORD-20260109-0001", productId: "prod-013", productName: "빽다방 대용량 커피 교환권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 3, amount: 13500, buyerName: "강태양", recipientName: "백수아", recipientPhone: "010-9012-3456", status: "CREATED", createdAt: "2026-01-09 12:40:00" },
  { id: "ord-010", orderNumber: "ORD-20260110-0001", productId: "prod-015", productName: "롯데시네마 관람권", channelId: "ch-002", channelName: "카카오선물하기", quantity: 2, amount: 25000, buyerName: "문지영", recipientName: "신동혁", recipientPhone: "010-0123-4567", status: "PAID", createdAt: "2026-01-10 15:50:00" },
  { id: "ord-011", orderNumber: "ORD-20260111-0001", productId: "prod-001", productName: "스타벅스 아메리카노 교환권", channelId: "ch-004", channelName: "쿠팡", quantity: 4, amount: 19200, buyerName: "권나연", recipientName: "홍길동", recipientPhone: "010-1122-3344", status: "PAID", createdAt: "2026-01-11 10:00:00" },
  { id: "ord-012", orderNumber: "ORD-20260112-0001", productId: "prod-012", productName: "투썸플레이스 아이스크림 교환권", channelId: "ch-005", channelName: "11번가", quantity: 2, amount: 11000, buyerName: "조민준", recipientName: "안소영", recipientPhone: "010-2233-4455", status: "CANCEL_REQUESTED", createdAt: "2026-01-12 09:30:00" },
  { id: "ord-013", orderNumber: "ORD-20260113-0001", productId: "prod-003", productName: "올리브영 1만원권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 3, amount: 28500, buyerName: "유선희", recipientName: "김나리", recipientPhone: "010-3344-5566", status: "PAID", createdAt: "2026-01-13 14:20:00" },
  { id: "ord-014", orderNumber: "ORD-20260114-0001", productId: "prod-005", productName: "CGV 영화 관람권", channelId: "ch-003", channelName: "네이버 쇼핑", quantity: 1, amount: 13000, buyerName: "남주혁", recipientName: "전미래", recipientPhone: "010-4455-6677", status: "PAID", createdAt: "2026-01-14 16:10:00" },
  { id: "ord-015", orderNumber: "ORD-20260115-0001", productId: "prod-004", productName: "배달의민족 2만원권", channelId: "ch-002", channelName: "카카오선물하기", quantity: 1, amount: 19000, buyerName: "서지현", recipientName: "고은비", recipientPhone: "010-5566-7788", status: "PAID", createdAt: "2026-01-15 11:00:00" },
  { id: "ord-016", orderNumber: "ORD-20260116-0001", productId: "prod-008", productName: "이마트 5만원권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 2, amount: 96000, buyerName: "하준서", recipientName: "이도현", recipientPhone: "010-6677-8899", status: "CANCELED", createdAt: "2026-01-16 13:45:00" },
  { id: "ord-017", orderNumber: "ORD-20260117-0001", productId: "prod-006", productName: "GS25 5천원권", channelId: "ch-004", channelName: "쿠팡", quantity: 10, amount: 47000, buyerName: "황도연", recipientName: "전지훈", recipientPhone: "010-7788-9900", status: "PAID", createdAt: "2026-01-17 08:30:00" },
  { id: "ord-018", orderNumber: "ORD-20260118-0001", productId: "prod-002", productName: "스타벅스 케이크 교환권", channelId: "ch-005", channelName: "11번가", quantity: 2, amount: 15000, buyerName: "양채영", recipientName: "손민지", recipientPhone: "010-8899-0011", status: "PAID", createdAt: "2026-01-18 17:20:00" },
  { id: "ord-019", orderNumber: "ORD-20260119-0001", productId: "prod-015", productName: "롯데시네마 관람권", channelId: "ch-003", channelName: "네이버 쇼핑", quantity: 3, amount: 37500, buyerName: "박지훈", recipientName: "최아름", recipientPhone: "010-9900-1122", status: "CREATED", createdAt: "2026-01-19 10:15:00" },
  { id: "ord-020", orderNumber: "ORD-20260120-0001", productId: "prod-011", productName: "쿠팡이츠 1만원권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 1, amount: 9200, buyerName: "김도윤", recipientName: "이서준", recipientPhone: "010-0011-2233", status: "PAID", createdAt: "2026-01-20 14:00:00" },
  { id: "ord-021", orderNumber: "ORD-20260201-0001", productId: "prod-001", productName: "스타벅스 아메리카노 교환권", channelId: "ch-002", channelName: "카카오선물하기", quantity: 5, amount: 24000, buyerName: "신하은", recipientName: "정서윤", recipientPhone: "010-1234-1234", status: "PAID", createdAt: "2026-02-01 09:00:00" },
  { id: "ord-022", orderNumber: "ORD-20260202-0001", productId: "prod-003", productName: "올리브영 1만원권", channelId: "ch-003", channelName: "네이버 쇼핑", quantity: 2, amount: 19000, buyerName: "류지안", recipientName: "임하린", recipientPhone: "010-2345-2345", status: "PAID", createdAt: "2026-02-02 13:30:00" },
  { id: "ord-023", orderNumber: "ORD-20260203-0001", productId: "prod-013", productName: "빽다방 대용량 커피 교환권", channelId: "ch-004", channelName: "쿠팡", quantity: 4, amount: 18000, buyerName: "배성우", recipientName: "고예린", recipientPhone: "010-3456-3456", status: "CANCEL_REQUESTED", createdAt: "2026-02-03 11:15:00" },
  { id: "ord-024", orderNumber: "ORD-20260204-0001", productId: "prod-005", productName: "CGV 영화 관람권", channelId: "ch-005", channelName: "11번가", quantity: 2, amount: 26000, buyerName: "조서현", recipientName: "민지우", recipientPhone: "010-4567-4567", status: "PAID", createdAt: "2026-02-04 16:00:00" },
  { id: "ord-025", orderNumber: "ORD-20260205-0001", productId: "prod-012", productName: "투썸플레이스 아이스크림 교환권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 3, amount: 16500, buyerName: "윤서아", recipientName: "강지현", recipientPhone: "010-5678-5678", status: "PAID", createdAt: "2026-02-05 10:45:00" },
  { id: "ord-026", orderNumber: "ORD-20260206-0001", productId: "prod-008", productName: "이마트 5만원권", channelId: "ch-002", channelName: "카카오선물하기", quantity: 1, amount: 48000, buyerName: "이준호", recipientName: "박민아", recipientPhone: "010-6789-6789", status: "PAID", createdAt: "2026-02-06 09:20:00" },
  { id: "ord-027", orderNumber: "ORD-20260207-0001", productId: "prod-004", productName: "배달의민족 2만원권", channelId: "ch-003", channelName: "네이버 쇼핑", quantity: 3, amount: 57000, buyerName: "최지은", recipientName: "장수빈", recipientPhone: "010-7890-7890", status: "PAID", createdAt: "2026-02-07 14:30:00" },
  { id: "ord-028", orderNumber: "ORD-20260208-0001", productId: "prod-006", productName: "GS25 5천원권", channelId: "ch-001", channelName: "폰기프트몰", quantity: 8, amount: 37600, buyerName: "한승우", recipientName: "노지민", recipientPhone: "010-8901-8901", status: "CANCELED", createdAt: "2026-02-08 12:00:00" },
  { id: "ord-029", orderNumber: "ORD-20260209-0001", productId: "prod-015", productName: "롯데시네마 관람권", channelId: "ch-004", channelName: "쿠팡", quantity: 2, amount: 25000, buyerName: "임수연", recipientName: "정해진", recipientPhone: "010-9012-9012", status: "PAID", createdAt: "2026-02-09 15:10:00" },
  { id: "ord-030", orderNumber: "ORD-20260210-0001", productId: "prod-011", productName: "쿠팡이츠 1만원권", channelId: "ch-005", channelName: "11번가", quantity: 2, amount: 18400, buyerName: "김수현", recipientName: "이진아", recipientPhone: "010-0123-0123", status: "PAID", createdAt: "2026-02-10 11:50:00" },
];

// Vouchers
export const vouchers: Voucher[] = [
  { id: "v-001", voucherCode: "SBUX-2026-AAAA-1111", orderId: "ord-001", productName: "스타벅스 아메리카노 교환권", recipientName: "박서연", recipientPhone: "010-1234-5678", status: "REDEEMED", issuedAt: "2026-01-01 10:30:00", deliveredAt: "2026-01-01 10:31:00", redeemedAt: "2026-01-03 14:20:00", expiresAt: "2027-01-01", faceValue: 5000 },
  { id: "v-002", voucherCode: "SBUX-2026-AAAA-1112", orderId: "ord-001", productName: "스타벅스 아메리카노 교환권", recipientName: "박서연", recipientPhone: "010-1234-5678", status: "DELIVERED", issuedAt: "2026-01-01 10:30:00", deliveredAt: "2026-01-01 10:31:00", redeemedAt: null, expiresAt: "2027-01-01", faceValue: 5000 },
  { id: "v-003", voucherCode: "OLIV-2026-BBBB-2221", orderId: "ord-002", productName: "올리브영 1만원권", recipientName: "최유진", recipientPhone: "010-2345-6789", status: "DELIVERED", issuedAt: "2026-01-02 14:20:00", deliveredAt: "2026-01-02 14:21:00", redeemedAt: null, expiresAt: "2027-01-02", faceValue: 10000 },
  { id: "v-004", voucherCode: "CGV0-2026-CCCC-3331", orderId: "ord-003", productName: "CGV 영화 관람권", recipientName: "이하나", recipientPhone: "010-3456-7890", status: "ISSUED", issuedAt: "2026-01-03 09:10:00", deliveredAt: null, redeemedAt: null, expiresAt: "2027-01-03", faceValue: 15000 },
  { id: "v-005", voucherCode: "IMAR-2026-DDDD-4441", orderId: "ord-004", productName: "이마트 5만원권", recipientName: "정다은", recipientPhone: "010-4567-8901", status: "REDEEMED", issuedAt: "2026-01-04 16:50:00", deliveredAt: "2026-01-04 16:51:00", redeemedAt: "2026-01-10 11:00:00", expiresAt: "2027-01-04", faceValue: 50000 },
  { id: "v-006", voucherCode: "BMIN-2026-EEEE-5551", orderId: "ord-005", productName: "배달의민족 2만원권", recipientName: "강민서", recipientPhone: "010-5678-9012", status: "DELIVERED", issuedAt: "2026-01-05 11:35:00", deliveredAt: "2026-01-05 11:36:00", redeemedAt: null, expiresAt: "2027-01-05", faceValue: 20000 },
  { id: "v-007", voucherCode: "BMIN-2026-EEEE-5552", orderId: "ord-005", productName: "배달의민족 2만원권", recipientName: "강민서", recipientPhone: "010-5678-9012", status: "REDEEMED", issuedAt: "2026-01-05 11:35:00", deliveredAt: "2026-01-05 11:36:00", redeemedAt: "2026-01-08 19:30:00", expiresAt: "2027-01-05", faceValue: 20000 },
  { id: "v-008", voucherCode: "GS25-2026-FFFF-6661", orderId: "ord-007", productName: "GS25 5천원권", recipientName: "오지원", recipientPhone: "010-7890-1234", status: "EXPIRED", issuedAt: "2025-01-07 08:20:00", deliveredAt: "2025-01-07 08:21:00", redeemedAt: null, expiresAt: "2025-12-31", faceValue: 5000 },
  { id: "v-009", voucherCode: "CEOT-2026-GGGG-7771", orderId: "ord-008", productName: "쿠팡이츠 1만원권", recipientName: "류성민", recipientPhone: "010-8901-2345", status: "DELIVERED", issuedAt: "2026-01-08 17:05:00", deliveredAt: "2026-01-08 17:06:00", redeemedAt: null, expiresAt: "2026-07-08", faceValue: 10000 },
  { id: "v-010", voucherCode: "LOCI-2026-HHHH-8881", orderId: "ord-010", productName: "롯데시네마 관람권", recipientName: "신동혁", recipientPhone: "010-0123-4567", status: "REDEEMED", issuedAt: "2026-01-10 15:55:00", deliveredAt: "2026-01-10 15:56:00", redeemedAt: "2026-01-14 18:00:00", expiresAt: "2027-01-10", faceValue: 14000 },
  { id: "v-011", voucherCode: "SBUX-2026-IIII-9991", orderId: "ord-011", productName: "스타벅스 아메리카노 교환권", recipientName: "홍길동", recipientPhone: "010-1122-3344", status: "DELIVERED", issuedAt: "2026-01-11 10:05:00", deliveredAt: "2026-01-11 10:06:00", redeemedAt: null, expiresAt: "2027-01-11", faceValue: 5000 },
  { id: "v-012", voucherCode: "OLIV-2026-JJJJ-0001", orderId: "ord-013", productName: "올리브영 1만원권", recipientName: "김나리", recipientPhone: "010-3344-5566", status: "REDEEMED", issuedAt: "2026-01-13 14:25:00", deliveredAt: "2026-01-13 14:26:00", redeemedAt: "2026-01-20 15:00:00", expiresAt: "2027-01-13", faceValue: 10000 },
  { id: "v-013", voucherCode: "CGV0-2026-KKKK-1111", orderId: "ord-014", productName: "CGV 영화 관람권", recipientName: "전미래", recipientPhone: "010-4455-6677", status: "DELIVERED", issuedAt: "2026-01-14 16:15:00", deliveredAt: "2026-01-14 16:16:00", redeemedAt: null, expiresAt: "2027-01-14", faceValue: 15000 },
  { id: "v-014", voucherCode: "BMIN-2026-LLLL-2221", orderId: "ord-015", productName: "배달의민족 2만원권", recipientName: "고은비", recipientPhone: "010-5566-7788", status: "DELIVERED", issuedAt: "2026-01-15 11:05:00", deliveredAt: "2026-01-15 11:06:00", redeemedAt: null, expiresAt: "2027-01-15", faceValue: 20000 },
  { id: "v-015", voucherCode: "GS25-2026-MMMM-3331", orderId: "ord-017", productName: "GS25 5천원권", recipientName: "전지훈", recipientPhone: "010-7788-9900", status: "REDEEMED", issuedAt: "2026-01-17 08:35:00", deliveredAt: "2026-01-17 08:36:00", redeemedAt: "2026-01-25 12:00:00", expiresAt: "2027-01-17", faceValue: 5000 },
  { id: "v-016", voucherCode: "SBUX-2026-NNNN-4441", orderId: "ord-018", productName: "스타벅스 케이크 교환권", recipientName: "손민지", recipientPhone: "010-8899-0011", status: "DELIVERED", issuedAt: "2026-01-18 17:25:00", deliveredAt: "2026-01-18 17:26:00", redeemedAt: null, expiresAt: "2026-07-18", faceValue: 8000 },
  { id: "v-017", voucherCode: "CEOT-2026-OOOO-5551", orderId: "ord-020", productName: "쿠팡이츠 1만원권", recipientName: "이서준", recipientPhone: "010-0011-2233", status: "ISSUED", issuedAt: "2026-01-20 14:05:00", deliveredAt: null, redeemedAt: null, expiresAt: "2026-07-20", faceValue: 10000 },
  { id: "v-018", voucherCode: "SBUX-2026-PPPP-6661", orderId: "ord-021", productName: "스타벅스 아메리카노 교환권", recipientName: "정서윤", recipientPhone: "010-1234-1234", status: "REDEEMED", issuedAt: "2026-02-01 09:05:00", deliveredAt: "2026-02-01 09:06:00", redeemedAt: "2026-02-05 10:00:00", expiresAt: "2027-02-01", faceValue: 5000 },
  { id: "v-019", voucherCode: "OLIV-2026-QQQQ-7771", orderId: "ord-022", productName: "올리브영 1만원권", recipientName: "임하린", recipientPhone: "010-2345-2345", status: "DELIVERED", issuedAt: "2026-02-02 13:35:00", deliveredAt: "2026-02-02 13:36:00", redeemedAt: null, expiresAt: "2027-02-02", faceValue: 10000 },
  { id: "v-020", voucherCode: "CGV0-2026-RRRR-8881", orderId: "ord-024", productName: "CGV 영화 관람권", recipientName: "민지우", recipientPhone: "010-4567-4567", status: "DELIVERED", issuedAt: "2026-02-04 16:05:00", deliveredAt: "2026-02-04 16:06:00", redeemedAt: null, expiresAt: "2027-02-04", faceValue: 15000 },
  { id: "v-021", voucherCode: "TSPL-2026-SSSS-9991", orderId: "ord-025", productName: "투썸플레이스 아이스크림 교환권", recipientName: "강지현", recipientPhone: "010-5678-5678", status: "REDEEMED", issuedAt: "2026-02-05 10:50:00", deliveredAt: "2026-02-05 10:51:00", redeemedAt: "2026-02-10 14:00:00", expiresAt: "2026-05-05", faceValue: 6000 },
  { id: "v-022", voucherCode: "IMAR-2026-TTTT-0001", orderId: "ord-026", productName: "이마트 5만원권", recipientName: "박민아", recipientPhone: "010-6789-6789", status: "DELIVERED", issuedAt: "2026-02-06 09:25:00", deliveredAt: "2026-02-06 09:26:00", redeemedAt: null, expiresAt: "2027-02-06", faceValue: 50000 },
  { id: "v-023", voucherCode: "BMIN-2026-UUUU-1111", orderId: "ord-027", productName: "배달의민족 2만원권", recipientName: "장수빈", recipientPhone: "010-7890-7890", status: "REDEEMED", issuedAt: "2026-02-07 14:35:00", deliveredAt: "2026-02-07 14:36:00", redeemedAt: "2026-02-14 19:00:00", expiresAt: "2027-02-07", faceValue: 20000 },
  { id: "v-024", voucherCode: "LOCI-2026-VVVV-2221", orderId: "ord-029", productName: "롯데시네마 관람권", recipientName: "정해진", recipientPhone: "010-9012-9012", status: "DELIVERED", issuedAt: "2026-02-09 15:15:00", deliveredAt: "2026-02-09 15:16:00", redeemedAt: null, expiresAt: "2027-02-09", faceValue: 14000 },
  { id: "v-025", voucherCode: "CEOT-2026-WWWW-3331", orderId: "ord-030", productName: "쿠팡이츠 1만원권", recipientName: "이진아", recipientPhone: "010-0123-0123", status: "DELIVERED", issuedAt: "2026-02-10 11:55:00", deliveredAt: "2026-02-10 11:56:00", redeemedAt: null, expiresAt: "2026-08-10", faceValue: 10000 },
  { id: "v-026", voucherCode: "GS25-2025-XXXX-4441", orderId: "ord-007", productName: "GS25 5천원권", recipientName: "오지원", recipientPhone: "010-7890-1234", status: "EXPIRED", issuedAt: "2025-01-07 08:20:00", deliveredAt: "2025-01-07 08:21:00", redeemedAt: null, expiresAt: "2025-12-31", faceValue: 5000 },
  { id: "v-027", voucherCode: "SBUX-2026-YYYY-5551", orderId: "ord-021", productName: "스타벅스 아메리카노 교환권", recipientName: "정서윤", recipientPhone: "010-1234-1234", status: "DELIVERED", issuedAt: "2026-02-01 09:05:00", deliveredAt: "2026-02-01 09:06:00", redeemedAt: null, expiresAt: "2027-02-01", faceValue: 5000 },
  { id: "v-028", voucherCode: "SBUX-2026-ZZZZ-6661", orderId: "ord-021", productName: "스타벅스 아메리카노 교환권", recipientName: "정서윤", recipientPhone: "010-1234-1234", status: "REDEEMED", issuedAt: "2026-02-01 09:05:00", deliveredAt: "2026-02-01 09:06:00", redeemedAt: "2026-02-03 11:00:00", expiresAt: "2027-02-01", faceValue: 5000 },
  { id: "v-029", voucherCode: "BBDG-2026-AA11-7771", orderId: "ord-009", productName: "빽다방 대용량 커피 교환권", recipientName: "백수아", recipientPhone: "010-9012-3456", status: "ISSUED", issuedAt: "2026-01-09 12:45:00", deliveredAt: null, redeemedAt: null, expiresAt: "2026-04-09", faceValue: 5000 },
  { id: "v-030", voucherCode: "LOCI-2026-BB22-8881", orderId: "ord-010", productName: "롯데시네마 관람권", recipientName: "신동혁", recipientPhone: "010-0123-4567", status: "DELIVERED", issuedAt: "2026-01-10 15:55:00", deliveredAt: "2026-01-10 15:56:00", redeemedAt: null, expiresAt: "2027-01-10", faceValue: 14000 },
  { id: "v-031", voucherCode: "SBUX-2026-CC33-9991", orderId: "ord-011", productName: "스타벅스 아메리카노 교환권", recipientName: "홍길동", recipientPhone: "010-1122-3344", status: "REDEEMED", issuedAt: "2026-01-11 10:05:00", deliveredAt: "2026-01-11 10:06:00", redeemedAt: "2026-01-15 09:00:00", expiresAt: "2027-01-11", faceValue: 5000 },
  { id: "v-032", voucherCode: "SBUX-2026-DD44-0001", orderId: "ord-011", productName: "스타벅스 아메리카노 교환권", recipientName: "홍길동", recipientPhone: "010-1122-3344", status: "EXPIRED", issuedAt: "2025-01-11 10:05:00", deliveredAt: "2025-01-11 10:06:00", redeemedAt: null, expiresAt: "2025-12-31", faceValue: 5000 },
  { id: "v-033", voucherCode: "OLIV-2026-EE55-1111", orderId: "ord-013", productName: "올리브영 1만원권", recipientName: "김나리", recipientPhone: "010-3344-5566", status: "DELIVERED", issuedAt: "2026-01-13 14:25:00", deliveredAt: "2026-01-13 14:26:00", redeemedAt: null, expiresAt: "2027-01-13", faceValue: 10000 },
  { id: "v-034", voucherCode: "OLIV-2026-FF66-2221", orderId: "ord-013", productName: "올리브영 1만원권", recipientName: "김나리", recipientPhone: "010-3344-5566", status: "REDEEMED", issuedAt: "2026-01-13 14:25:00", deliveredAt: "2026-01-13 14:26:00", redeemedAt: "2026-01-22 16:00:00", expiresAt: "2027-01-13", faceValue: 10000 },
  { id: "v-035", voucherCode: "CGV0-2026-GG77-3331", orderId: "ord-003", productName: "CGV 영화 관람권", recipientName: "이하나", recipientPhone: "010-3456-7890", status: "ISSUED", issuedAt: "2026-01-03 09:10:00", deliveredAt: null, redeemedAt: null, expiresAt: "2027-01-03", faceValue: 15000 },
  { id: "v-036", voucherCode: "TSPL-2026-HH88-4441", orderId: "ord-025", productName: "투썸플레이스 아이스크림 교환권", recipientName: "강지현", recipientPhone: "010-5678-5678", status: "DELIVERED", issuedAt: "2026-02-05 10:50:00", deliveredAt: "2026-02-05 10:51:00", redeemedAt: null, expiresAt: "2026-05-05", faceValue: 6000 },
  { id: "v-037", voucherCode: "GS25-2026-II99-5551", orderId: "ord-017", productName: "GS25 5천원권", recipientName: "전지훈", recipientPhone: "010-7788-9900", status: "DELIVERED", issuedAt: "2026-01-17 08:35:00", deliveredAt: "2026-01-17 08:36:00", redeemedAt: null, expiresAt: "2027-01-17", faceValue: 5000 },
  { id: "v-038", voucherCode: "BMIN-2026-JJ00-6661", orderId: "ord-027", productName: "배달의민족 2만원권", recipientName: "장수빈", recipientPhone: "010-7890-7890", status: "DELIVERED", issuedAt: "2026-02-07 14:35:00", deliveredAt: "2026-02-07 14:36:00", redeemedAt: null, expiresAt: "2027-02-07", faceValue: 20000 },
  { id: "v-039", voucherCode: "BMIN-2026-KK11-7771", orderId: "ord-027", productName: "배달의민족 2만원권", recipientName: "장수빈", recipientPhone: "010-7890-7890", status: "REDEEMED", issuedAt: "2026-02-07 14:35:00", deliveredAt: "2026-02-07 14:36:00", redeemedAt: "2026-02-12 20:00:00", expiresAt: "2027-02-07", faceValue: 20000 },
  { id: "v-040", voucherCode: "SBUX-2026-LL22-8881", orderId: "ord-018", productName: "스타벅스 케이크 교환권", recipientName: "손민지", recipientPhone: "010-8899-0011", status: "REDEEMED", issuedAt: "2026-01-18 17:25:00", deliveredAt: "2026-01-18 17:26:00", redeemedAt: "2026-01-22 10:00:00", expiresAt: "2026-07-18", faceValue: 8000 },
  { id: "v-041", voucherCode: "LOCI-2026-MM33-9991", orderId: "ord-019", productName: "롯데시네마 관람권", recipientName: "최아름", recipientPhone: "010-9900-1122", status: "ISSUED", issuedAt: "2026-01-19 10:20:00", deliveredAt: null, redeemedAt: null, expiresAt: "2027-01-19", faceValue: 14000 },
  { id: "v-042", voucherCode: "LOCI-2026-NN44-0001", orderId: "ord-019", productName: "롯데시네마 관람권", recipientName: "최아름", recipientPhone: "010-9900-1122", status: "DELIVERED", issuedAt: "2026-01-19 10:20:00", deliveredAt: "2026-01-19 10:21:00", redeemedAt: null, expiresAt: "2027-01-19", faceValue: 14000 },
  { id: "v-043", voucherCode: "LOCI-2026-OO55-1111", orderId: "ord-019", productName: "롯데시네마 관람권", recipientName: "최아름", recipientPhone: "010-9900-1122", status: "EXPIRED", issuedAt: "2025-01-19 10:20:00", deliveredAt: "2025-01-19 10:21:00", redeemedAt: null, expiresAt: "2025-12-31", faceValue: 14000 },
  { id: "v-044", voucherCode: "CEOT-2026-PP66-2221", orderId: "ord-008", productName: "쿠팡이츠 1만원권", recipientName: "류성민", recipientPhone: "010-8901-2345", status: "REDEEMED", issuedAt: "2026-01-08 17:05:00", deliveredAt: "2026-01-08 17:06:00", redeemedAt: "2026-01-15 13:00:00", expiresAt: "2026-07-08", faceValue: 10000 },
  { id: "v-045", voucherCode: "BBDG-2026-QQ77-3331", orderId: "ord-009", productName: "빽다방 대용량 커피 교환권", recipientName: "백수아", recipientPhone: "010-9012-3456", status: "DELIVERED", issuedAt: "2026-01-09 12:45:00", deliveredAt: "2026-01-09 12:46:00", redeemedAt: null, expiresAt: "2026-04-09", faceValue: 5000 },
  { id: "v-046", voucherCode: "OLIV-2026-RR88-4441", orderId: "ord-022", productName: "올리브영 1만원권", recipientName: "임하린", recipientPhone: "010-2345-2345", status: "REDEEMED", issuedAt: "2026-02-02 13:35:00", deliveredAt: "2026-02-02 13:36:00", redeemedAt: "2026-02-10 15:00:00", expiresAt: "2027-02-02", faceValue: 10000 },
  { id: "v-047", voucherCode: "CGV0-2026-SS99-5551", orderId: "ord-024", productName: "CGV 영화 관람권", recipientName: "민지우", recipientPhone: "010-4567-4567", status: "REDEEMED", issuedAt: "2026-02-04 16:05:00", deliveredAt: "2026-02-04 16:06:00", redeemedAt: "2026-02-11 17:30:00", expiresAt: "2027-02-04", faceValue: 15000 },
  { id: "v-048", voucherCode: "LOCI-2026-TT00-6661", orderId: "ord-029", productName: "롯데시네마 관람권", recipientName: "정해진", recipientPhone: "010-9012-9012", status: "REDEEMED", issuedAt: "2026-02-09 15:15:00", deliveredAt: "2026-02-09 15:16:00", redeemedAt: "2026-02-15 19:00:00", expiresAt: "2027-02-09", faceValue: 14000 },
  { id: "v-049", voucherCode: "CEOT-2026-UU11-7771", orderId: "ord-030", productName: "쿠팡이츠 1만원권", recipientName: "이진아", recipientPhone: "010-0123-0123", status: "REDEEMED", issuedAt: "2026-02-10 11:55:00", deliveredAt: "2026-02-10 11:56:00", redeemedAt: "2026-02-16 14:00:00", expiresAt: "2026-08-10", faceValue: 10000 },
  { id: "v-050", voucherCode: "IMAR-2026-VV22-8881", orderId: "ord-016", productName: "이마트 5만원권", recipientName: "이도현", recipientPhone: "010-6677-8899", status: "EXPIRED", issuedAt: "2025-01-16 13:50:00", deliveredAt: "2025-01-16 13:51:00", redeemedAt: null, expiresAt: "2025-12-31", faceValue: 50000 },
];

// Settlement Data (12 months)
export const settlementData: SettlementMonth[] = [
  { month: "2025-03", totalSales: 28500000, totalVouchers: 1240, commission: 1425000, settlementAmount: 27075000, status: "SETTLED" },
  { month: "2025-04", totalSales: 32000000, totalVouchers: 1380, commission: 1600000, settlementAmount: 30400000, status: "SETTLED" },
  { month: "2025-05", totalSales: 38500000, totalVouchers: 1650, commission: 1925000, settlementAmount: 36575000, status: "SETTLED" },
  { month: "2025-06", totalSales: 42000000, totalVouchers: 1820, commission: 2100000, settlementAmount: 39900000, status: "SETTLED" },
  { month: "2025-07", totalSales: 35000000, totalVouchers: 1500, commission: 1750000, settlementAmount: 33250000, status: "SETTLED" },
  { month: "2025-08", totalSales: 45000000, totalVouchers: 1950, commission: 2250000, settlementAmount: 42750000, status: "SETTLED" },
  { month: "2025-09", totalSales: 39000000, totalVouchers: 1680, commission: 1950000, settlementAmount: 37050000, status: "SETTLED" },
  { month: "2025-10", totalSales: 48000000, totalVouchers: 2050, commission: 2400000, settlementAmount: 45600000, status: "SETTLED" },
  { month: "2025-11", totalSales: 52000000, totalVouchers: 2280, commission: 2600000, settlementAmount: 49400000, status: "SETTLED" },
  { month: "2025-12", totalSales: 68000000, totalVouchers: 3100, commission: 3400000, settlementAmount: 64600000, status: "SETTLED" },
  { month: "2026-01", totalSales: 115000000, totalVouchers: 2650, commission: 5750000, settlementAmount: 109250000, status: "SETTLED" },
  { month: "2026-02", totalSales: 142580000, totalVouchers: 2847, commission: 7129000, settlementAmount: 135451000, status: "PENDING" },
];

// Dashboard Stats
export const dashboardStats = {
  totalSalesThisMonth: 142580000,
  issuedVouchers: 2847,
  activeProducts: 12,
  channelCount: 5,
  salesGrowth: 12.3,
  vouchersGrowth: 8.5,
};

// Monthly sales chart data (12 months)
export const monthlySales = [
  { month: "3월", sales: 28500000, vouchers: 1240 },
  { month: "4월", sales: 32000000, vouchers: 1380 },
  { month: "5월", sales: 38500000, vouchers: 1650 },
  { month: "6월", sales: 42000000, vouchers: 1820 },
  { month: "7월", sales: 35000000, vouchers: 1500 },
  { month: "8월", sales: 45000000, vouchers: 1950 },
  { month: "9월", sales: 39000000, vouchers: 1680 },
  { month: "10월", sales: 48000000, vouchers: 2050 },
  { month: "11월", sales: 52000000, vouchers: 2280 },
  { month: "12월", sales: 68000000, vouchers: 3100 },
  { month: "1월", sales: 115000000, vouchers: 2650 },
  { month: "2월", sales: 142580000, vouchers: 2847 },
];

// Channel sales data for chart
export const channelSales = [
  { name: "폰기프트몰", sales: 52000000 },
  { name: "카카오선물하기", sales: 38500000 },
  { name: "네이버 쇼핑", sales: 27000000 },
  { name: "쿠팡", sales: 15080000 },
  { name: "11번가", sales: 10000000 },
];

// Voucher status distribution
export const voucherStatusData = [
  { name: "사용완료", value: 45, color: "#10B981" },
  { name: "미사용", value: 35, color: "#7634CB" },
  { name: "만료", value: 20, color: "#6B7280" },
];

// Users
export const users: User[] = [
  { id: "u-001", name: "김담당", email: "kim@techstart.co.kr", role: "관리자", status: "ACTIVE", lastLogin: "2026-02-10 09:15:00" },
  { id: "u-002", name: "이영업", email: "lee@techstart.co.kr", role: "담당자", status: "ACTIVE", lastLogin: "2026-02-09 14:30:00" },
  { id: "u-003", name: "박마케팅", email: "park@techstart.co.kr", role: "담당자", status: "ACTIVE", lastLogin: "2026-02-08 11:00:00" },
  { id: "u-004", name: "최재무", email: "choi@techstart.co.kr", role: "담당자", status: "INACTIVE", lastLogin: "2026-01-15 16:45:00" },
  { id: "u-005", name: "정운영", email: "jung@techstart.co.kr", role: "담당자", status: "ACTIVE", lastLogin: "2026-02-10 08:00:00" },
];

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("ko-KR").format(value);
};
