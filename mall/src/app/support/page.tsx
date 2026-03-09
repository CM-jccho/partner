"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type TabKey = "FAQ" | "문의하기";

const faqs = [
  {
    id: "f1",
    question: "상품권 구매 후 즉시 사용 가능한가요?",
    answer:
      "네, 결제 완료 후 즉시 상품권이 발행됩니다. 카카오톡으로 수신자에게 전달되며, '상품권' 탭에서도 확인하실 수 있습니다.",
  },
  {
    id: "f2",
    question: "상품권 유효기간이 지나면 어떻게 되나요?",
    answer:
      "유효기간이 만료된 상품권은 사용이 불가합니다. 만료 30일 전에 SMS로 알림을 드리니 기간 내 사용하시기 바랍니다. 유효기간 연장은 고객센터로 문의하세요.",
  },
  {
    id: "f3",
    question: "환불은 어떻게 신청하나요?",
    answer:
      "미사용 상품권에 한해 구매 후 7일 이내 환불 신청이 가능합니다. 주문 내역에서 '취소 신청' 버튼을 클릭하거나 고객센터로 문의해 주세요.",
  },
  {
    id: "f4",
    question: "상품권을 다른 사람에게 전달할 수 있나요?",
    answer:
      "네, 상품권 상세 화면에서 '상품권 전달하기' 버튼을 이용하면 다른 사람에게 카카오톡으로 전달하실 수 있습니다.",
  },
  {
    id: "f5",
    question: "결제 수단은 어떤 것들이 있나요?",
    answer:
      "신용카드, 카카오페이, 네이버페이, 토스페이, 휴대폰결제를 지원합니다. 결제 화면에서 원하시는 수단을 선택해 주세요.",
  },
  {
    id: "f6",
    question: "포인트는 어떻게 적립되나요?",
    answer:
      "퐁기프트에서 상품권 구매 시 결제금액의 1%가 포인트로 적립됩니다. 적립된 포인트는 다음 구매 시 사용하실 수 있습니다.",
  },
  {
    id: "f7",
    question: "쿠폰은 어떻게 등록하나요?",
    answer:
      "결제 화면의 '할인/쿠폰' 섹션에서 쿠폰을 선택하여 적용할 수 있습니다. 쿠폰 코드 등록은 마이페이지 > 쿠폰함에서 가능합니다.",
  },
  {
    id: "f8",
    question: "상품권이 카카오톡으로 오지 않아요",
    answer:
      "수신자의 카카오톡 계정과 전화번호가 일치하지 않을 경우 발송이 지연될 수 있습니다. '주문 내역'에서 재발송 버튼을 이용하시거나 고객센터로 문의해 주세요.",
  },
  {
    id: "f9",
    question: "상품권 금액을 나눠서 사용할 수 있나요?",
    answer:
      "상품권 종류에 따라 다릅니다. 금액형 상품권(예: 올리브영 3만원)은 잔액이 남을 경우 재사용 가능하지만, 교환권 형태는 1회 전액 사용됩니다.",
  },
  {
    id: "f10",
    question: "회원가입 없이도 구매할 수 있나요?",
    answer:
      "현재 퐁기프트는 회원 전용 서비스입니다. 카카오 계정 또는 이메일로 간편 가입 후 이용하실 수 있습니다. 가입은 3분도 걸리지 않습니다.",
  },
];

const inquiryCategories = [
  "주문/결제 문의",
  "상품권 사용 문의",
  "환불/취소 문의",
  "배송/발송 문의",
  "계정 문의",
  "기타",
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("FAQ");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setCategory("");
    setTitle("");
    setContent("");
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Title */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-black text-gray-900">고객센터</h1>
        <p className="text-sm text-gray-400 mt-0.5">평일 09:00 - 18:00 운영</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
        <div className="flex">
          {(["FAQ", "문의하기"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors border-b-2",
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Tab */}
      {activeTab === "FAQ" && (
        <div className="px-4 py-3 space-y-2">
          <p className="text-xs text-gray-400 font-medium py-1">
            자주 묻는 질문 {faqs.length}개
          </p>
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                }
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-gray-900 pr-3 leading-tight">
                  {faq.question}
                </span>
                {expandedFaq === faq.id ? (
                  <ChevronUp size={16} className="text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed pt-3">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 문의하기 Tab */}
      {activeTab === "문의하기" && (
        <div className="px-4 py-4">
          {submitted ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">문의가 접수되었습니다!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                영업일 기준 1-2일 내에<br />
                이메일로 답변 드리겠습니다
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-primary text-sm font-semibold hover:underline"
              >
                새 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="bg-white rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-gray-900">문의 내용</h3>

                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                    문의 유형
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none focus:border-primary"
                  >
                    <option value="">문의 유형을 선택하세요</option>
                    {inquiryCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                    제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="문의 제목을 입력하세요"
                    className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                    내용
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    placeholder="문의 내용을 자세히 입력해 주세요. (주문번호, 상품명 등을 포함하면 더 빠른 처리가 가능합니다)"
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  답변은 가입하신 이메일(minji@example.com)로 발송됩니다.<br />
                  운영 시간: 평일 09:00 - 18:00 (주말/공휴일 제외)
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                className="h-12 text-base"
              >
                문의 제출하기
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
