import React, { useState } from 'react';
import { ShoppingCart, UtensilsCrossed, Calendar } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  desc: string;
  tag: string | null;
  icon: string;
}

interface CartItem extends MenuItem {
  count: number;
}

const MENU_DATA: MenuItem[] = [
  { id: 1, name: '크라페', price: 4500, desc: '연습용', tag: '인기', icon: '🥞' },
  { id: 2, name: '미정', price: 0, desc: '미정', tag: null, icon: 'X' },
  { id: 3, name: '미정', price: 0, desc: '미정', tag: null, icon: 'X' },
  { id: 4, name: '미정', price: 0, desc: '미정', tag: null, icon: 'X' },
  { id: 5, name: '미정', price: 0, desc: '미정', tag: null, icon: 'X' },
  { id: 6, name: '미정', price: 0, desc: '미정', tag: null, icon: 'X' },
];

export default function OrderView() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (menu: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === menu.id);
      if (exists) {
        return prev.map((item) =>
          item.id === menu.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { ...menu, count: 1 }];
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.count, 0);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col justify-between overflow-hidden h-screen">
      <div className="flex-1 flex overflow-hidden">
        {/* 메뉴 리스트 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {MENU_DATA.map((menu) => {
              // '미정'이거나 가격이 0인 메뉴 체크
              const isDisabled = menu.name === '미정' || menu.price === 0;

              return (
                <div
                  key={menu.id}
                  onClick={() => !isDisabled && addToCart(menu)}
                  className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative transition ${
                    isDisabled
                      ? 'opacity-40 pointer-events-none select-none grayscale' // 희미함 + 클릭금지 + 흑백
                      : 'cursor-pointer hover:border-black'
                  }`}
                >
                  {menu.tag && !isDisabled && (
                    <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {menu.tag}
                    </span>
                  )}
                  <div className="text-3xl mb-3">{menu.icon}</div>
                  <h3 className="font-bold text-base text-gray-900">{menu.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 mb-4 h-8 line-clamp-2">{menu.desc}</p>
                  <p className="font-bold text-base text-gray-900">
                    {isDisabled ? '준비 중' : `${menu.price.toLocaleString()}원`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 장바구니 영역 */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-6">
              <ShoppingCart size={20} /> 장바구니
            </h2>

            {cart.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-300 text-center">
                <ShoppingCart size={48} className="mb-2 stroke-1" />
                <p className="text-xs">메뉴를 선택해 주세요</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.price.toLocaleString()}원 × {item.count}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      {(item.price * item.count).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 pt-4 border-t">
              <span className="text-gray-500 font-medium text-sm">합계</span>
              <span className="text-2xl font-black text-gray-900">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            <button
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-base transition ${
                cart.length > 0
                  ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              결제하기 →
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-3 px-8 flex justify-center gap-16">
        <button className="flex flex-col items-center text-black font-bold text-xs gap-1 cursor-pointer">
          <UtensilsCrossed size={20} />
          <span>주문하기</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 text-xs gap-1 hover:text-gray-600 cursor-pointer">
          <Calendar size={20} />
          <span>사전예약</span>
        </button>
      </footer>
    </div>
  );
}