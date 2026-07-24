import { useState } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import OrderView from './components/OrderView';
import AdminAuth from './components/adminpassward'; // 👈 오타 수정 및 컴포넌트 연결

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'order' | 'admin'>('home');

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col bg-black overflow-hidden font-sans select-none">
      {/* 헤더에 currentView와 setCurrentView 전달 */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {/* 1. 홈 화면 */}
      {currentView === 'home' && (
        <HomeView onStartOrder={() => setCurrentView('order')} />
      )}

      {/* 2. 주문 화면 */}
      {currentView === 'order' && (
        <OrderView />
      )}

      {/* 3. 관리자 인증 화면 */}
      {currentView === 'admin' && (
        <AdminAuth
          onSuccess={() => {
            alert('관리자 인증에 성공했습니다!');
            // TODO: 관리자 페이지 컴포넌트가 있다면 해당 뷰로 이동하도록 처리
            setCurrentView('home'); 
          }}
        />
      )}
    </div>
  );
}