const pool = require("../DB/db")

//주문
exports.postOrder = async (req, res) => {
    try {
        const user = req.session.user;
        // const user = "admin" //임시
        console.log("현재 로그인한 사용자: ", user)
        const {
            total_price,
            total_quantity,
            base_address,
            detailed_address,
            postal_code,
            card_id,
            expiration_date,
            card_company,
            orderItems,
            type
        } = req.body;
        console.log("받은 orderItems:", orderItems);

        // order_id 생성 (timestamp)
        const order_id = Date.now().toString(); 

        // order_booklist 테이블에 insert (여러 권의 책 처리) 및 재고 업데이트
        for (const item of orderItems) {
            const { book_book_id, order_quantity, order_price } = item;
            console.log("책 정보: ", item)

            // 현재 재고량
            const [bookStock] = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_book_id]);
            const stock = bookStock[0].stock;
            console.log("현재 재고량: ", stock)

            if (stock < order_quantity) {
                return res.status(400).send({ msg: `도서 ${book_book_id}의 재고가 부족합니다. (현재 재고: ${stock})` });
            }
        }

        // 모든 책의 재고가 충분하면 주문 처리 진행
        // order 테이블에 insert
        const [insertOrderInfo] = await pool.query(
            "INSERT INTO \`order\` (order_id, order_date, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user_id) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [order_id, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user]
        );

        for (const item of orderItems) {
            const { book_book_id, order_quantity, order_price } = item;

            // order_booklist 테이블에 insert
            await pool.query(
                "INSERT INTO order_booklist (order_quantity, order_price, book_book_id, order_order_id) VALUES (?, ?, ?, ?)",
                [order_quantity, order_price, book_book_id, order_id]
            );

            // 책 재고 업데이트 (감소)
            await pool.query("UPDATE book SET stock = stock - ? WHERE book_id = ?", [order_quantity, book_book_id]);
        }

        //장바구니 비우기
        const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?",[user])
        console.log(cartId)
        if (type === "cart") {
            await pool.query("DELETE FROM cart_booklist WHERE cart_cart_id = ?",[cartId[0][0].cart_id])
            console.log("장바구니 비우기")
        }

        res.send({ msg: "주문 완료", order_id: order_id }); // 주문 완료 응답에 order_id 포함

        // //현재 재고량 - 주문 수량이 0보다 클 때만 실행
        // if (bookStock[0].stock - total_quantity > 0) {
                // stock을 하나에 도서의 재고로 봤지만 total_quantity은 총 주문 수량임
                // 여러 도서의 경우 각 도서의 stock과 각 도서의 order_quantity와 비교해야함함
        //     //order 테이블에 insert
        //     const [insertOrderInfo] = await pool.query(`INSERT INTO \`order\`(order_id, order_date, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user_id) VALUES(?,NOW(),?,?,?,?,?,?,?,?,?)`, [order_id, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user]);

        //     //order_booklist 테이블에 insert
        //     const [insertOrderList] = await pool.query("INSERT INTO order_booklist (order_quantity, order_price, book_book_id, order_order_id) VALUES(?,?,?,?)", [total_quantity, total_price, book_book_id, order_id])
        //     console.log("주문 완료, 주문 내역 생성")
                // order_booklist에서 order_quantity, order_price에 total_quantity, total_price를 넣을경우
                // 여기에서도 book_id가있기에 하나의 주문에서 여러책일 경우 각 도서에 대한 주문량과 가격이 들어가야하지만
                // 각 각의 도서에 총 수량, 총 금액이 들어가게됨됨

        //     //주문 후, 수량 업데이트
        //     const [updateStock] = await pool.query("UPDATE book SET stock = stock - ? WHERE book_id = ?", [total_quantity, book_book_id]);
                //total_quantity일 경우 하나의 책의 재고에서 주문총량만큼 감소됨

        //     //업데이트 후 재고량
        //     const [selectUpdateStock] = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_book_id]);
        //     console.log("업데이트 후 남은 재고량: ", selectUpdateStock[0].stock)

        //     //order_id = ? 인 주문 목록 가져오기
        //     const [selectOrderList] = await pool.query("SELECT * FROM order_booklist WHERE order_order_id = ?", [order_id])
        //     console.log("order_id 구매 목록: ", selectOrderList);

        //     res.send({
        //         msg: "주문 완료",
        //         msg2: "주문 내역 생성",
        //         selectUpdateStock: selectUpdateStock[0].stock,
        //         selectOrderList: selectOrderList
        //     }) //selectUpdateStock랑 selectOrderList는 필요 시 사용 
        // } else {
        //     console.log("재고량 부족")
        //     res.send({ msg: "재고량 부족" })
        // }
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