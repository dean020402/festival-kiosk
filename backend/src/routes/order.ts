import {Router} from "express";
import axios from "axios";
import { GetClient } from "../config/db";

const router = Router();

router.post("/confirm",async(req,res)=>{
    const { paymentKey, order_id,amount,phone_number,menu_id,quantity} = req.body;

    const client = await GetClient();

    try {
        
        const secretKey = process.env.TOSS_SECRET_KEY || "test_sk_Ba5PzR0ArnEAK5zREkJaVvmYnNeD";

        const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

        const tossResponse = await axios.post(
            "https://api.tosspayments.com/v1/payments/confirm",
            { paymentKey,orderId:order_id,amount},
            {
                headers:{
                    Authorization:`Basic ${basicAuth}`,
                    "content-Type":"application/json"
                },
            }
        );
        
        if (tossResponse.status === 200){

            await client.query("BEGIN");

            const orderSql =` 
            INSERT INTO orders (order_id,phone_number,total_amount,status)
            VALUES ($1,$2,$3,'결제가 완료 되었습니다')`;

            await client.query(orderSql,[order_id,phone_number,amount]);

            const detailSql=`
            INSERT INTO ordermenu (order_id,menu_id,quantity)
            VALUES ($1,$2,$3)`;

            await client.query(detailSql,[order_id,menu_id,quantity])

            const stockSql=`
            UPDATE menu
            SET stock = ctock -$1
            WHERE menu_id = $2 AND stock >= $1`;

            const stockREsult = await client.query(stockSql,[quantity,menu_id]);

            if (stockREsult.rowCount === 0){
                throw Error("현재 재고가 부족하여 잠시후 다시 오세요!! 죄송합니다ㅠㅠ");
            }

            await client.query("COMMIT");

            return res.json({
                success: true,
                message: "결제가 완료 되었습니다"

            });

        } else{
            throw new Error("토스 페이먼츠 승인 응단이 올바르지 않습니다. 다시 시도 해주세요");
        }
    } catch(error: any){

        await client.query("ROLLBACK");
        console.log("결제 및 트랙젝선 오류 발생:", error.response?.data || error.message);

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
