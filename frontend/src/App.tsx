import { useState } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import OrderView from './components/OrderView';

export default function App() {
  // 'home' 또는 'order' 화면 전환 상태
  const [currentView, setCurrentView] = useState<'home' | 'order'>('home');

  return (
    // 아이패드 비율(가로)에 부합하도록 전체 화면 구성
    <div className="fixed inset-0 w-full h-[100dvh]flex flex-col bg-black overflow-hidden font-sans select-none">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {currentView === 'home' ? (
        <HomeView onStartOrder={() => setCurrentView('order')} />
      ) : (
        <OrderView />
      )}
    </div>
  );
}
