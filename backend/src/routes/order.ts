import {Router} from "express";
import axios from "axios";
import { GetClient } from "../config/db.ts";

const router = Router();
//여기 까지가 라이브러리 및 모듈 로드
router.post("/",async(req,res)=>{ // /confirm 을 통해 들어오는 post 요청을 처리를 한다
   const { 
        paymentKey, 
        order_id, 
        amount, 
        phone_number, 
        menu_id, 
        quantity,
        order_type, // 예: 'DELIVERY', 'TAKEOUT' 등 (orders 테이블 NOT NULL 대비)
        method      // 예: '간편결제', '카드' 등 (payment 테이블 NOT NULL 대비)
    } = req.body; // req.body 구조 분해 할당 프론트엔드에서 보낸 결제 승인에 필요한 값과 주문을 처리할 값을 받아온다

    const client = await GetClient(); // DB작업을 수행할 클라이언트 인스턴스를 하나 획득

    let transactionStart = false;
    try {
        
        const secretKey = process.env.TOSS_SECRET_KEY || "test_sk_Ba5PzR0ArnEAK5zREkJaVvmYnNeD";
        //secretKey : .env 파일에 설정한 환경변수 값을 쓰되, 없으면 테스트용 시크릿 키를 기본값으로 FALLBACK 사용한다
        const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");
        //토스페이먼츠 API는 HTTP basic Auth 방식을 요구한다. 비밀번호 부분은 비워두고 시크릿키 구조의 문자열을 base64형태로 바꿔 헤더에 넣을 준비한다.
        const tossResponse = await axios.post(
            "https://api.tosspayments.com/v1/payments/confirm",
            { paymentKey,orderId:order_id,amount},
            {
                headers:{
                    Authorization:`Basic ${basicAuth}`,
                    "content-Type":"application/json"
                },
            } // 토스페이먼츠 승인 API엔드 포인트로 결제 정보를 전송을 한다 여기서 await 비동기 같은 경우는 잠시 대기 역활을 한다. 특징으로는 서버가 죽지 않고 다른일 을 할수있게 해준다.
        );
        
        if (tossResponse.status === 200){
            
            await client.query("BEGIN");
            // SQL트랜잭션을 시작한다. 이 이하의 DB작업은 전부 성공해야만 commit이 되고 아니면 롤백을 당하게 된다
            transactionStart = true;
            const approvedAt = tossResponse.data.approvedAt || new Date().toISOString();
            
           const paymentSql = `
                INSERT INTO payment (payment_key, order_id, method, amount, approved_at)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (payment_key) DO NOTHING;
            `;
            await client.query(paymentSql, [paymentKey, order_id, method || "카드", amount, approvedAt]);
           
            const orderSql =` 
            INSERT INTO orders (order_id,phone_number,total_amount,order_type,order_status,payment_key)
            VALUES ($1,$2,$3,$4,'결제가 완료 되었습니다',$5)`;

            await client.query(orderSql,[order_id,phone_number,amount,order_type || "부스",paymentKey]);
            // TABLE에 주문내역을 삽입 한다. SQL injection 공격을 바지 하기 위해 $1등 파라미터 바인딩 방식을 사용한다.
            const detailSql=`
            INSERT INTO ordermenu (order_id,menu_id,quantity)
            VALUES ($1,$2,$3)`;

            await client.query(detailSql,[order_id,menu_id,quantity])
            //상세 메뉴 추가  어떤 메뉴를 몇개 샀는지 상세 정보를 기록 한다.
            const stockSql=`
            UPDATE menu
            SET stock = stock -$1
            WHERE menu_id = $2 AND stock >= $1`; // 이 조건을 걸어 둔것은 주문 수량보다 남은 재고가 많을 때만 업데이트 되게 걸어둔것

            const stockREsult = await client.query(stockSql,[quantity,menu_id]);

            if (stockREsult.rowCount === 0){
                throw Error("현재 재고가 부족하여 잠시후 다시 오세요!! 죄송합니다ㅠㅠ");
            } //재고가 부족해서 업데이트된 행이 없다면 에러를 강제로 던져 결제를 취소시키는 비즈니스 로직을 수앻ㅇ한다

            await client.query("COMMIT"); //트랜잭션이 완벽하게 끝났으므로 DB에 최종 반영을 지시한다

            return res.json({
                success: true,
                message: "결제가 완료 되었습니다"

            }); //클라이언트에게 결제와 주문이 모두 성공 했음을 알린다

        } else{
            throw new Error("토스 페이먼츠 승인 응단이 올바르지 않습니다. 다시 시도 해주세요");
        }
    } catch(error: any){ // 53열 65열 또는 toss API와 연결이 끊기면은 이곳으로 빠지게 된다
        if (transactionStart){
            await client.query("ROLLBACK");
        }
        console.error("🔴 [에러 발생 원인]:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message:"결제 승인 또는 주문 처리중 오류가 발생하여 결제가 자동 취소 되었습니다.",
            error: error.resonse?.data || error.message
        });
    } finally{
        client.release();
    }
});

export default router;
