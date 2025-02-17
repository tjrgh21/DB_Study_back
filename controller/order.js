const pool = require("../DB/db")

//주문
exports.postOrder = async (req, res) => {
    try {
        // const user = req.session.user;
        const user = "admin" //임시
        console.log("현재 로그인한 사용자: ", user)
        const {
            order_id,
            total_price, //계산된 값 들어가야 함
            total_quantity,
            base_address,
            detailed_address,
            postal_code,
            card_id,
            expiration_date,
            card_company,
            book_book_id //구매할 책 id도 가져와야 함
        } = req.body;


        //현재 재고량
        const [bookStock] = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_book_id]);
        console.log("현재 재고량: ", bookStock[0].stock)

        //현재 재고량 - 주문 수량이 0보다 클 때만 실행
        if (bookStock[0].stock - total_quantity > 0) {
            //order 테이블에 insert
            const [insertOrderInfo] = await pool.query(`INSERT INTO \`order\`(order_id, order_date, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user_id) VALUES(?,NOW(),?,?,?,?,?,?,?,?,?)`, [order_id, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user]);

            //order_booklist 테이블에 insert
            const [insertOrderList] = await pool.query("INSERT INTO order_booklist (order_quantity, order_price, book_book_id, order_order_id) VALUES(?,?,?,?)", [total_quantity, total_price, book_book_id, order_id])
            console.log("주문 완료, 주문 내역 생성")

            //주문 후, 수량 업데이트
            const [updateStock] = await pool.query("UPDATE book SET stock = stock - ? WHERE book_id = ?", [total_quantity, book_book_id]);

            //업데이트 후 재고량
            const [selectUpdateStock] = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_book_id]);
            console.log("업데이트 후 남은 재고량: ", selectUpdateStock[0].stock)

            //order_id = ? 인 주문 목록 가져오기
            const [selectOrderList] = await pool.query("SELECT * FROM order_booklist WHERE order_order_id = ?", [order_id])
            console.log("order_id 구매 목록: ", selectOrderList);

            res.send({
                msg: "주문 완료",
                msg2: "주문 내역 생성",
                selectUpdateStock: selectUpdateStock[0].stock,
                selectOrderList: selectOrderList
            }) //selectUpdateStock랑 selectOrderList는 필요 시 사용 
        } else {
            console.log("재고량 부족")
            res.send({ msg: "재고량 부족" })
        }
    } catch (err) {
        console.error(err)
    }
}

/*
postman용 임시 데이터
{
    "order_id": 4584,
    "total_price": 10000,
    "total_quantity": 2,
    "base_address": "부산광역시",
    "detailed_address": "사상구 주례동",
    "postal_code": "45678",
    "card_id": "1",
    "expiration_date": "2027-02-07",
    "card_company": "KBbank",
    "user_id": "admin"
}
  */