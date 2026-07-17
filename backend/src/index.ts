import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRouter from "./routes/order"; // 👈 결제 라우터 파일 경로에 맞게 수정하세요!

// .env 파일의 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. 필수 미들웨어 설정
// ==========================================

// 프론트엔드 서버가 이 백엔드 API를 호출할 수 있도록 허용 (CORS 설정)
app.use(cors({
    origin: "*", // 실제 서비스 시에는 프론트엔드의 특정 도메인 주소로 변경하는 것이 안전합니다.
    credentials: true
}));

// ⭐️ 가장 중요! 포스트맨이나 프론트에서 보낸 JSON 바디를 읽을 수 있게 해줍니다.
app.use(express.json()); 

// URL-encoded 형식의 폼 데이터도 처리할 수 있도록 지원
app.use(express.urlencoded({ extended: true }));


// ==========================================
// 2. 라우터 등록
// ==========================================

// 앞서 만든 결제 확인 라우터를 등록합니다.
// 이렇게 하면 결제 승인 엔드포인트 주소는 http://localhost:3000/confirm 이 됩니다.
app.use("/confirm", paymentRouter); 


// 기본 헬스체크용 엔드포인트 (서버가 잘 켜졌는지 확인용)
app.get("/", (req, res) => {
    res.send("Festival Kiosk Backend Server is Running!");
});


// ==========================================
// 3. 서버 실행
// ==========================================
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  🚀 서버가 성공적으로 시작되었습니다!`);
    console.log(`  📡 주소: http://localhost:${PORT}`);
    console.log(`  테스트 엔드포인트: http://localhost:${PORT}/confirm`);
    console.log(`==================================================`);
});