import { Pool } from "pg"; // postgreSQL 공식 라이브러리에서 pg에서 Pool 이라는 클래스를 가져온다
import dotenv from "dotenv"; // 외부 .env 파일에 적어둔 보안키나 주소를 가져오기 위한 라이브러리!!

dotenv.config(); // 이 code 실행이 되는 순간 같은 폴더에 있는 .env 파일 안에 있는 설정갑들이 node.js 시스템 메모리에 적제가 된다

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
}); // pool이라는 변수를 선언을 해서 장바구니 객체를 생성 한다 그리고 데이터베이스 주소를 가져와서 SQL과 대화 할수 있는 연결 하는 역활을 한다
export const query = (text: string, params?: any[]) => pool.query(text, params);
//(text : string, params?: any[])는 매게 변수 이다 그리고 화살표함수 사용 , 그리고 params에서 ?는 선택사항 옵셔널 이다.
//query는 단발성 함수 (SELECT*FROM"Menu;) 같이 단순 조회나 트랜잭션이 필요 없는 단순 작어을 할때 아주 간단하게 사용할수있는것이다
export const GetClient = () => pool.connect();
//수동 트랜잭션용 클라이언트 애여 함수 BEGIN -> INSERT -> COMMIT/ROLLBACK 처럼 여러 SQl을 하나으 세트로 묶어서 제어할때
//pool 장바구니에서 연결다리 딱하나를 빌려오는 역활을 한다(pool.connect)