import React, {useState, useEffect } from 'react';
import {Utensils, Settings, Home} from 'lucide-react';

interface HeaderProps {
    currentView: 'home'| 'order';
    setCurrentView: React.Dispatch<React.SetStateAction<'home' | 'order'>>;

}

export default function Header({currentView, setCurrentView}: HeaderProps) {
    const [time, setTime] = useState(new Date());
    
    useEffect(()=>{
        const timer = setInterval(()=>{
            setTime(new Date());
        },1000);

        return ()=> clearInterval(timer);
    },[]);

    const formattedTime = time.toLocaleTimeString('ko-KR',{
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12: false,
    });
    return(
        <header className="flex justify-between items-center px-6 py-0 bg-white border-b text-gray-800">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                    <Utensils size={20} />
                </div>
                <div>
                <h1 className="!font-medium !text-black flex items-center gap-1 ">
                    화염무술부
                </h1>
                <p className="text-xs text-black-500">
                    27년 소축제
                </p>
                </div>
            </div>
            <div className="flex items-center spave-x-4 text-sm text-gray-600">
                {currentView === 'order' && (
                    <button onClick={()=> setCurrentView('home')} 
                    className="flex items-center gap-1 hover:text-black font-medium cursor-pointer">
                        <Home size={16 }/> 처음으로
                    </button>
                )}
                <button className="flex items-center gap-1 hover:text-black font-medium cursor-pointer">
                    <Settings size={16}/> 관리자
                </button>
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>운영중</span>
                    <span className="text-gray-500 font-mono">{formattedTime}</span>
                </div>
            </div>
        </header>
    );
}