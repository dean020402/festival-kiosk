import React, {useState} from 'react';
import {Delete} from 'lucide-react';

interface AdminAuthprops{
    onSuccess:() => void;
}

interface LoginResponse {
    success: boolean;
    message?: string;
    token?: string;
}

export default function AdminAuth({ onSuccess}: AdminAuthprops){
    const [pin,setPin] =useState<string>('');
    const [error,setError] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);

    const handleNumberClick = (num: string) =>{
        if (pin.length< 4 && !loading) {
            const nextPin = pin +num;
            setPin(nextPin);
            setError('');

            if (nextPin.length === 4){
                verifyPin(nextPin)
            }
        }
    };
    const verifyPin = async (enteredPin : string) =>{
        setLoading(true);
        try{
            const response = await fetch('http://localhost:3000/api/admin/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: enteredPin }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.success) {
        // 토큰 관리가 필요하다면 저장 (예: localStorage)
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        onSuccess();
      } else {
        setError(data.message || '비밀번호가 올바르지 않습니다.');
        setPin(''); // 입력 초기화
      }
    } catch (err) {
      setError('인증 중 오류가 발생했습니다. 다시 시도해주세요.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  // 한 글자 지우기
  const handleDelete = () => {
    if (!loading) {
      setPin((prev) => prev.slice(0, -1));
      setError('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111318] text-white p-4">
      {/* 타이틀 및 안내 문구 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">관리자 인증</h1>
        <p className="text-gray-400 text-sm">비밀번호 4자리를 입력하세요</p>
      </div>

      {/* PIN 표시 인디케이터 (4개 도트) */}
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full border border-gray-500 transition-all ${
              pin.length > index ? 'bg-white border-white' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 text-sm mb-4 animate-pulse">{error}</p>
      )}

      {/* 3x4 키패드 */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={loading}
            className="h-16 rounded-xl bg-[#212735] hover:bg-[#2c3447] text-2xl font-semibold flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
          >
            {num}
          </button>
        ))}

        {/* 빈 공간 (좌측 하단) */}
        <div />

        {/* 0 버튼 */}
        <button
          onClick={() => handleNumberClick('0')}
          disabled={loading}
          className="h-16 rounded-xl bg-[#212735] hover:bg-[#2c3447] text-2xl font-semibold flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
        >
          0
        </button>

        {/* 지우기 버튼 */}
        <button
          onClick={handleDelete}
          disabled={loading || pin.length === 0}
          className="h-16 rounded-xl bg-[#212735] hover:bg-[#2c3447] flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
        >
          <Delete className="w-6 h-6 text-gray-300" />
        </button>
      </div>

      {/* 하단 힌트 문구 */}
      <p className="mt-12 text-gray-500 text-xs text-center">
        힌트: 기본 비밀번호는 1234입니다
      </p>
    </div>
  );
}
