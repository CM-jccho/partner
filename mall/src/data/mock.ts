export type Category =
  | "카페"
  | "편의점"
  | "외식"
  | "쇼핑"
  | "마트"
  | "영화"
  | "도서"
  | "뷰티"
  | "패션"
  | "여행";

export type OrderStatus = "CREATED" | "PAID" | "CANCELED";
export type VoucherStatus = "ISSUED" | "DELIVERED" | "REDEEMED" | "EXPIRED";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  imageUrl: string;
  usageInfo: string[];
  expiryDays: number;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  brand: string;
  price: number;
  status: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  message: string;
  quantity: number;
  createdAt: string;
}

export interface Voucher {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  brand: string;
  faceValue: number;
  status: VoucherStatus;
  expiryDate: string;
  issuedAt: string;
  barcode: string;
  usageHistory: { date: string; amount: number; location: string }[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  link: string;
}

export const categories: { name: Category; emoji: string }[] = [
  { name: "카페", emoji: "☕" },
  { name: "편의점", emoji: "🏪" },
  { name: "외식", emoji: "🍽️" },
  { name: "쇼핑", emoji: "🛍️" },
  { name: "마트", emoji: "🛒" },
  { name: "영화", emoji: "🎬" },
  { name: "도서", emoji: "📚" },
  { name: "뷰티", emoji: "💄" },
  { name: "패션", emoji: "👗" },
  { name: "여행", emoji: "✈️" },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "스타벅스 아메리카노 Tall",
    brand: "스타벅스",
    category: "카페",
    price: 4050,
    originalPrice: 4500,
    discount: 10,
    description:
      "스타벅스 아메리카노 Tall 사이즈 모바일 상품권입니다. 전국 스타벅스 매장에서 사용 가능하며, 신선하고 풍부한 에스프레소의 맛을 즐기세요.",
    imageUrl: "https://placehold.co/400x300/00704A/FFFFFF?text=Starbucks",
    usageInfo: [
      "전국 스타벅스 매장 사용 가능",
      "드라이브 스루 이용 가능",
      "사이렌 오더 불가",
    ],
    expiryDays: 90,
    rating: 4.8,
    reviewCount: 2341,
    tags: ["커피", "아메리카노", "스타벅스"],
  },
  {
    id: "p2",
    name: "올리브영 3만원 상품권",
    brand: "올리브영",
    category: "뷰티",
    price: 27000,
    originalPrice: 30000,
    discount: 10,
    description:
      "올리브영 3만원 금액권입니다. 스킨케어, 메이크업, 헤어케어 등 다양한 뷰티 제품 구매에 사용하세요.",
    imageUrl: "https://placehold.co/400x300/E91E8C/FFFFFF?text=OliveYoung",
    usageInfo: [
      "전국 올리브영 매장 사용 가능",
      "올리브영 온라인몰 사용 가능",
      "잔액 환불 불가",
    ],
    expiryDays: 365,
    rating: 4.6,
    reviewCount: 1892,
    tags: ["뷰티", "화장품", "올리브영"],
  },
  {
    id: "p3",
    name: "배달의민족 1만원 쿠폰",
    brand: "배달의민족",
    category: "외식",
    price: 9000,
    originalPrice: 10000,
    discount: 10,
    description:
      "배달의민족 1만원 할인 쿠폰입니다. 치킨, 피자, 중식, 한식 등 다양한 음식 배달에 사용하세요.",
    imageUrl: "https://placehold.co/400x300/2AC1BC/FFFFFF?text=BaeminCoupon",
    usageInfo: [
      "배달의민족 앱에서 사용 가능",
      "최소 주문금액 12,000원 이상",
      "중복 할인 불가",
    ],
    expiryDays: 30,
    rating: 4.5,
    reviewCount: 5621,
    tags: ["배달", "음식", "할인쿠폰"],
  },
  {
    id: "p4",
    name: "교보문고 5만원 도서상품권",
    brand: "교보문고",
    category: "도서",
    price: 47500,
    originalPrice: 50000,
    discount: 5,
    description:
      "교보문고 5만원 도서 상품권입니다. 베스트셀러부터 전문서적까지 원하는 책을 구매하세요.",
    imageUrl: "https://placehold.co/400x300/FF5722/FFFFFF?text=Kyobo",
    usageInfo: [
      "전국 교보문고 매장 사용 가능",
      "교보문고 온라인몰 사용 가능",
      "e-book 구매 가능",
    ],
    expiryDays: 365,
    rating: 4.7,
    reviewCount: 943,
    tags: ["도서", "책", "교보문고"],
  },
  {
    id: "p5",
    name: "GS25 편의점 상품권 1만원",
    brand: "GS25",
    category: "편의점",
    price: 9500,
    originalPrice: 10000,
    discount: 5,
    description:
      "GS25 편의점 1만원 모바일 상품권입니다. 음료, 스낵, 도시락 등 다양한 편의점 상품 구매에 사용하세요.",
    imageUrl: "https://placehold.co/400x300/005BAC/FFFFFF?text=GS25",
    usageInfo: [
      "전국 GS25 편의점 사용 가능",
      "주류 및 담배 구매 불가",
      "잔액 환불 불가",
    ],
    expiryDays: 180,
    rating: 4.3,
    reviewCount: 3201,
    tags: ["편의점", "GS25", "생활용품"],
  },
  {
    id: "p6",
    name: "이마트 5만원 상품권",
    brand: "이마트",
    category: "마트",
    price: 47000,
    originalPrice: 50000,
    discount: 6,
    description:
      "이마트 5만원 모바일 상품권입니다. 식품, 생활용품, 가전제품 등 다양한 상품 구매에 사용하세요.",
    imageUrl: "https://placehold.co/400x300/FFB800/FFFFFF?text=Emart",
    usageInfo: [
      "전국 이마트 매장 사용 가능",
      "이마트몰 사용 가능",
      "주차권 구매 불가",
    ],
    expiryDays: 365,
    rating: 4.4,
    reviewCount: 2109,
    tags: ["마트", "이마트", "쇼핑"],
  },
  {
    id: "p7",
    name: "CGV 영화관람권 2인",
    brand: "CGV",
    category: "영화",
    price: 22000,
    originalPrice: 28000,
    discount: 21,
    description:
      "CGV 영화관람권 2인권입니다. 일반 2D 영화 2편을 감상하실 수 있습니다. 주말 및 공휴일에도 사용 가능합니다.",
    imageUrl: "https://placehold.co/400x300/E20B13/FFFFFF?text=CGV",
    usageInfo: [
      "전국 CGV 매장 사용 가능",
      "일반 2D 영화만 해당",
      "IMAX, 4DX 추가 비용 발생",
    ],
    expiryDays: 90,
    rating: 4.6,
    reviewCount: 4532,
    tags: ["영화", "CGV", "관람권"],
  },
  {
    id: "p8",
    name: "메가커피 아메리카노 Large",
    brand: "메가커피",
    category: "카페",
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    description:
      "메가커피 아메리카노 Large 사이즈 모바일 쿠폰입니다. 저렴한 가격에 넉넉한 양의 아메리카노를 즐기세요.",
    imageUrl: "https://placehold.co/400x300/8B4513/FFFFFF?text=Mega",
    usageInfo: [
      "전국 메가커피 매장 사용 가능",
      "아이스/핫 선택 가능",
      "다른 쿠폰과 중복 불가",
    ],
    expiryDays: 60,
    rating: 4.2,
    reviewCount: 8921,
    tags: ["커피", "메가커피", "가성비"],
  },
  {
    id: "p9",
    name: "빽다방 빽스치노 1잔",
    brand: "빽다방",
    category: "카페",
    price: 2700,
    originalPrice: 3000,
    discount: 10,
    description:
      "빽다방 빽스치노 1잔 모바일 쿠폰입니다. 달콤하고 부드러운 빽스치노를 즐기세요.",
    imageUrl: "https://placehold.co/400x300/8D6E63/FFFFFF?text=Paik",
    usageInfo: [
      "전국 빽다방 매장 사용 가능",
      "사이즈 변경 불가",
      "유효기간 내 사용 필수",
    ],
    expiryDays: 60,
    rating: 4.3,
    reviewCount: 3211,
    tags: ["커피", "빽다방", "음료"],
  },
  {
    id: "p10",
    name: "롯데백화점 10만원 상품권",
    brand: "롯데백화점",
    category: "쇼핑",
    price: 95000,
    originalPrice: 100000,
    discount: 5,
    description:
      "롯데백화점 10만원 모바일 상품권입니다. 명품부터 생활용품까지 다양한 브랜드 상품 구매에 사용하세요.",
    imageUrl: "https://placehold.co/400x300/C62828/FFFFFF?text=Lotte",
    usageInfo: [
      "전국 롯데백화점 매장 사용 가능",
      "롯데닷컴 사용 가능",
      "일부 입점 매장 제외",
    ],
    expiryDays: 365,
    rating: 4.5,
    reviewCount: 1234,
    tags: ["백화점", "롯데", "고급"],
  },
  {
    id: "p11",
    name: "신세계상품권 5만원",
    brand: "신세계",
    category: "쇼핑",
    price: 47500,
    originalPrice: 50000,
    discount: 5,
    description:
      "신세계 5만원 모바일 상품권입니다. 신세계백화점, 이마트, 스타필드 등에서 사용 가능합니다.",
    imageUrl: "https://placehold.co/400x300/1A237E/FFFFFF?text=Shinsegae",
    usageInfo: [
      "신세계백화점 사용 가능",
      "이마트 사용 가능",
      "스타필드 사용 가능",
    ],
    expiryDays: 365,
    rating: 4.6,
    reviewCount: 2087,
    tags: ["백화점", "신세계", "상품권"],
  },
  {
    id: "p12",
    name: "쿠팡이츠 1만원 할인권",
    brand: "쿠팡이츠",
    category: "외식",
    price: 8500,
    originalPrice: 10000,
    discount: 15,
    description:
      "쿠팡이츠 1만원 할인권입니다. 빠른 배달 서비스로 원하는 음식을 빠르게 즐기세요.",
    imageUrl: "https://placehold.co/400x300/C0392B/FFFFFF?text=CoupangEats",
    usageInfo: [
      "쿠팡이츠 앱에서 사용 가능",
      "최소 주문금액 15,000원 이상",
      "배달비 별도",
    ],
    expiryDays: 30,
    rating: 4.4,
    reviewCount: 4321,
    tags: ["배달", "쿠팡이츠", "할인"],
  },
  {
    id: "p13",
    name: "이디야커피 아메리카노 2잔",
    brand: "이디야커피",
    category: "카페",
    price: 4500,
    originalPrice: 5000,
    discount: 10,
    description:
      "이디야커피 아메리카노 2잔 모바일 쿠폰입니다. 합리적인 가격에 두 잔의 아메리카노를 즐기세요.",
    imageUrl: "https://placehold.co/400x300/4A148C/FFFFFF?text=Ediya",
    usageInfo: [
      "전국 이디야커피 매장 사용 가능",
      "아이스/핫 선택 가능",
      "유효기간 내 1회 사용",
    ],
    expiryDays: 90,
    rating: 4.1,
    reviewCount: 2876,
    tags: ["커피", "이디야", "가성비"],
  },
  {
    id: "p14",
    name: "투썸플레이스 케이크 세트",
    brand: "투썸플레이스",
    category: "카페",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    description:
      "투썸플레이스 케이크 + 음료 세트 모바일 쿠폰입니다. 스트로베리 케이크와 아메리카노 조합으로 특별한 시간을 보내세요.",
    imageUrl: "https://placehold.co/400x300/D81B60/FFFFFF?text=Twosome",
    usageInfo: [
      "전국 투썸플레이스 매장 사용 가능",
      "케이크 품절 시 다른 케이크로 대체",
      "음료 사이즈 Tall 기준",
    ],
    expiryDays: 60,
    rating: 4.5,
    reviewCount: 3456,
    tags: ["카페", "케이크", "투썸플레이스"],
  },
  {
    id: "p15",
    name: "BBQ치킨 황금올리브 1마리",
    brand: "BBQ",
    category: "외식",
    price: 19000,
    originalPrice: 22000,
    discount: 14,
    description:
      "BBQ 황금올리브치킨 1마리 모바일 쿠폰입니다. 바삭하고 고소한 황금올리브치킨을 즐기세요.",
    imageUrl: "https://placehold.co/400x300/FF8F00/FFFFFF?text=BBQ",
    usageInfo: [
      "전국 BBQ 가맹점 사용 가능",
      "배달 및 포장 모두 가능",
      "추가 토핑 시 비용 발생",
    ],
    expiryDays: 90,
    rating: 4.4,
    reviewCount: 6789,
    tags: ["치킨", "BBQ", "황금올리브"],
  },
  {
    id: "p16",
    name: "GS25 편의점 3만원 상품권",
    brand: "GS25",
    category: "편의점",
    price: 28500,
    originalPrice: 30000,
    discount: 5,
    description:
      "GS25 편의점 3만원 모바일 상품권입니다. 생필품, 간식, 음료 등 다양한 상품을 구매하세요.",
    imageUrl: "https://placehold.co/400x300/005BAC/FFFFFF?text=GS25+3만원",
    usageInfo: [
      "전국 GS25 편의점 사용 가능",
      "주류 및 담배 구매 불가",
      "잔액 환불 불가",
    ],
    expiryDays: 180,
    rating: 4.2,
    reviewCount: 1567,
    tags: ["편의점", "GS25", "생활"],
  },
  {
    id: "p17",
    name: "제주항공 국내선 왕복 항공권",
    brand: "제주항공",
    category: "여행",
    price: 79000,
    originalPrice: 98000,
    discount: 19,
    description:
      "제주항공 국내선 왕복 항공권입니다. 서울-제주 노선을 저렴하게 여행하세요.",
    imageUrl: "https://placehold.co/400x300/FF6D00/FFFFFF?text=JejuAir",
    usageInfo: [
      "서울(김포/인천)-제주 노선",
      "성수기 일부 날짜 제외",
      "수하물 별도 구매 필요",
    ],
    expiryDays: 180,
    rating: 4.0,
    reviewCount: 987,
    tags: ["여행", "항공", "제주"],
  },
  {
    id: "p18",
    name: "무신사 5만원 상품권",
    brand: "무신사",
    category: "패션",
    price: 45000,
    originalPrice: 50000,
    discount: 10,
    description:
      "무신사 5만원 모바일 상품권입니다. 트렌디한 패션 아이템을 합리적인 가격에 구매하세요.",
    imageUrl: "https://placehold.co/400x300/212121/FFFFFF?text=Musinsa",
    usageInfo: [
      "무신사 앱/웹에서 사용 가능",
      "무신사 스탠다드 상품 구매 가능",
      "일부 브랜드 제외",
    ],
    expiryDays: 365,
    rating: 4.5,
    reviewCount: 3421,
    tags: ["패션", "무신사", "의류"],
  },
  {
    id: "p19",
    name: "CGV 팝콘 콤보 세트",
    brand: "CGV",
    category: "영화",
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    description:
      "CGV 팝콘 라지 + 음료 라지 콤보 세트 쿠폰입니다. 영화와 함께 즐기는 최고의 간식 조합입니다.",
    imageUrl: "https://placehold.co/400x300/E20B13/FFFFFF?text=CGV+Popcorn",
    usageInfo: [
      "전국 CGV 매장 스낵바에서 사용 가능",
      "음료 콜라/사이다 중 선택",
      "팝콘 버터/카라멜 중 선택",
    ],
    expiryDays: 90,
    rating: 4.3,
    reviewCount: 2134,
    tags: ["팝콘", "CGV", "영화관"],
  },
  {
    id: "p20",
    name: "이마트 2만원 상품권",
    brand: "이마트",
    category: "마트",
    price: 18800,
    originalPrice: 20000,
    discount: 6,
    description:
      "이마트 2만원 모바일 상품권입니다. 신선식품, 생필품, 의류 등 다양한 상품을 구매하세요.",
    imageUrl: "https://placehold.co/400x300/FFB800/FFFFFF?text=Emart+2만원",
    usageInfo: [
      "전국 이마트 매장 사용 가능",
      "이마트몰 사용 가능",
      "이마트24 사용 가능",
    ],
    expiryDays: 365,
    rating: 4.3,
    reviewCount: 1876,
    tags: ["마트", "이마트", "식품"],
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    orderNumber: "PG20240301001",
    productId: "p1",
    productName: "스타벅스 아메리카노 Tall",
    brand: "스타벅스",
    price: 4050,
    status: "PAID",
    recipientName: "김민지",
    recipientPhone: "010-1234-5678",
    message: "생일 축하해!",
    quantity: 1,
    createdAt: "2024-03-01T10:30:00",
  },
  {
    id: "o2",
    orderNumber: "PG20240228002",
    productId: "p7",
    productName: "CGV 영화관람권 2인",
    brand: "CGV",
    price: 22000,
    status: "PAID",
    recipientName: "이준혁",
    recipientPhone: "010-9876-5432",
    message: "수고했어!",
    quantity: 1,
    createdAt: "2024-02-28T15:45:00",
  },
  {
    id: "o3",
    orderNumber: "PG20240225003",
    productId: "p2",
    productName: "올리브영 3만원 상품권",
    brand: "올리브영",
    price: 27000,
    status: "CANCELED",
    recipientName: "박서연",
    recipientPhone: "010-5555-7777",
    message: "감사합니다!",
    quantity: 1,
    createdAt: "2024-02-25T09:20:00",
  },
  {
    id: "o4",
    orderNumber: "PG20240220004",
    productId: "p15",
    productName: "BBQ치킨 황금올리브 1마리",
    brand: "BBQ",
    price: 19000,
    status: "PAID",
    recipientName: "최동현",
    recipientPhone: "010-3333-8888",
    message: "오늘 저녁 치킨이야!",
    quantity: 1,
    createdAt: "2024-02-20T18:00:00",
  },
  {
    id: "o5",
    orderNumber: "PG20240215005",
    productId: "p10",
    productName: "롯데백화점 10만원 상품권",
    brand: "롯데백화점",
    price: 95000,
    status: "CREATED",
    recipientName: "정소희",
    recipientPhone: "010-2222-9999",
    message: "졸업 축하해요!",
    quantity: 1,
    createdAt: "2024-02-15T12:00:00",
  },
];

export const vouchers: Voucher[] = [
  {
    id: "v1",
    orderId: "o1",
    productId: "p1",
    productName: "스타벅스 아메리카노 Tall",
    brand: "스타벅스",
    faceValue: 4500,
    status: "DELIVERED",
    expiryDate: "2024-06-01",
    issuedAt: "2024-03-01T10:35:00",
    barcode: "880012340001",
    usageHistory: [],
  },
  {
    id: "v2",
    orderId: "o2",
    productId: "p7",
    productName: "CGV 영화관람권 2인",
    brand: "CGV",
    faceValue: 28000,
    status: "ISSUED",
    expiryDate: "2024-05-28",
    issuedAt: "2024-02-28T15:50:00",
    barcode: "880012340002",
    usageHistory: [],
  },
  {
    id: "v3",
    orderId: "o4",
    productId: "p15",
    productName: "BBQ치킨 황금올리브 1마리",
    brand: "BBQ",
    faceValue: 22000,
    status: "REDEEMED",
    expiryDate: "2024-05-20",
    issuedAt: "2024-02-20T18:05:00",
    barcode: "880012340003",
    usageHistory: [
      {
        date: "2024-02-21T19:30:00",
        amount: 22000,
        location: "BBQ 강남점",
      },
    ],
  },
  {
    id: "v4",
    orderId: "o5",
    productId: "p10",
    productName: "롯데백화점 10만원 상품권",
    brand: "롯데백화점",
    faceValue: 100000,
    status: "ISSUED",
    expiryDate: "2025-02-15",
    issuedAt: "2024-02-15T12:05:00",
    barcode: "880012340004",
    usageHistory: [],
  },
  {
    id: "v5",
    orderId: "o1",
    productId: "p8",
    productName: "메가커피 아메리카노 Large",
    brand: "메가커피",
    faceValue: 2000,
    status: "EXPIRED",
    expiryDate: "2024-01-15",
    issuedAt: "2023-11-15T10:00:00",
    barcode: "880012340005",
    usageHistory: [],
  },
  {
    id: "v6",
    orderId: "o2",
    productId: "p3",
    productName: "배달의민족 1만원 쿠폰",
    brand: "배달의민족",
    faceValue: 10000,
    status: "DELIVERED",
    expiryDate: "2024-04-01",
    issuedAt: "2024-03-01T09:00:00",
    barcode: "880012340006",
    usageHistory: [],
  },
  {
    id: "v7",
    orderId: "o3",
    productId: "p13",
    productName: "이디야커피 아메리카노 2잔",
    brand: "이디야커피",
    faceValue: 5000,
    status: "REDEEMED",
    expiryDate: "2024-05-10",
    issuedAt: "2024-02-10T14:00:00",
    barcode: "880012340007",
    usageHistory: [
      {
        date: "2024-02-14T10:00:00",
        amount: 5000,
        location: "이디야 홍대점",
      },
    ],
  },
  {
    id: "v8",
    orderId: "o4",
    productId: "p4",
    productName: "교보문고 5만원 도서상품권",
    brand: "교보문고",
    faceValue: 50000,
    status: "ISSUED",
    expiryDate: "2025-01-20",
    issuedAt: "2024-01-20T11:00:00",
    barcode: "880012340008",
    usageHistory: [],
  },
  {
    id: "v9",
    orderId: "o5",
    productId: "p14",
    productName: "투썸플레이스 케이크 세트",
    brand: "투썸플레이스",
    faceValue: 22000,
    status: "DELIVERED",
    expiryDate: "2024-05-05",
    issuedAt: "2024-03-05T16:00:00",
    barcode: "880012340009",
    usageHistory: [],
  },
  {
    id: "v10",
    orderId: "o1",
    productId: "p5",
    productName: "GS25 편의점 상품권 1만원",
    brand: "GS25",
    faceValue: 10000,
    status: "EXPIRED",
    expiryDate: "2024-02-01",
    issuedAt: "2023-08-01T09:00:00",
    barcode: "880012340010",
    usageHistory: [],
  },
];

export const banners: Banner[] = [
  {
    id: "b1",
    title: "이번 주 특가!",
    subtitle: "스타벅스 10% 할인",
    gradientFrom: "#FF4757",
    gradientTo: "#FF6B35",
    textColor: "white",
    link: "/products?category=카페",
  },
  {
    id: "b2",
    title: "올리브영 생일 선물",
    subtitle: "뷰티 상품권 추천",
    gradientFrom: "#7B2FBE",
    gradientTo: "#E91E8C",
    textColor: "white",
    link: "/products?category=뷰티",
  },
  {
    id: "b3",
    title: "CGV 영화관람권 특가",
    subtitle: "2인권 21% 할인 중",
    gradientFrom: "#1565C0",
    gradientTo: "#00BCD4",
    textColor: "white",
    link: "/products?category=영화",
  },
];
