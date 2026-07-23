import React from 'react';
import { UtensilsCrossed, CreditCard, MessageSquare, Calendar, ArrowRight, Utensils } from 'lucide-react';

interface HomeViewProps {
  onStartOrder: () => void;
}

export default function HomeView({ onStartOrder }: HomeViewProps) {
  return (
    <div className="flex-1 bg-[#1a1a1b] text-white flex flex-col justify-between p-16 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap gap-20 p-10 justify-center items-center">
        <div className="text-6xl">🍔</div>
        <div className="text-6xl">🍕</div>
        <div className="text-6xl">🌭</div>
        <div className="text-6xl">🍟</div>
      </div>

      {/* 중앙 메인 컨텐츠 */}
      <div className="max-w-2xl mx-auto text-center mt-12 z-11 flex flex-col items-center">
        

        <div className="inline-flex items-center gap-1.5 bg-gray-800 border border-gray-700 px-4 py-1.5 rounded-full text-sm mb-6 text-pink-300">
          <span>🎪</span> 27년 소축제
        </div>

        <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
          축제 부스<br />주문 시스템
        </h1>
        
        {/* 하단 카드 */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          <div className="bg-[#2a2a2c] p-4 rounded-xl border border-gray-800 text-center">
            <CreditCard className="mx-auto mb-2 text-gray-300" size={24} />
            <h3 className="font-bold text-sm">Toss 간편결제</h3>
          </div>
          <div className="bg-[#2a2a2c] p-4 rounded-xl border border-gray-800 text-center">
            <MessageSquare className="mx-auto mb-2 text-gray-300" size={24} />
            <h3 className="font-bold text-sm">카카오톡 알림</h3>
            <p className="text-xs text-gray-400 mt-1">실시간 주문 상태 안내</p>
          </div>
          <div className="bg-[#2a2a2c] p-4 rounded-xl border border-gray-800 text-center">
            <Calendar className="mx-auto mb-2 text-gray-300" size={24} />
            <h3 className="font-bold text-sm">사전 예약</h3>
            <p className="text-xs text-gray-400 mt-1">원하는 시간에 미리 예약</p>
          </div>
        </div>

        {/* 주문하기 버튼 */}
        <button
          onClick={onStartOrder}
          className="w-full max-w-2xl bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg hover:bg-gray-100 transition active:scale-95 shadow-xl cursor-pointer"
        >
          <UtensilsCrossed size={20} />
          <span>지금 주문하기</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}