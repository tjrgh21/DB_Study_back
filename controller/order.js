const pool = require("../DB/db")

//주문
exports.postOrder = async (req, res) => {
    try {
        const user = req.session.user;
        // const user = "admin" //임시
        console.log(user)
        const {
            order_id,
            total_price,
            total_quantity,
            base_address,
            detailed_address,
            postal_code,
            card_id,
            expiration_date,
            card_company,
            book_book_id //구매할 책 id도 가져와야 함
        } = req.body;

        //order 테이블에 insert
        const [insertOrderInfo] = await pool.query(`INSERT INTO \`order\`(order_id, order_date, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user_id) VALUES(?,NOW(),?,?,?,?,?,?,?,?,?)`, [order_id, total_price, total_quantity, base_address, detailed_address, postal_code, card_id, expiration_date, card_company, user]);
        res.send({ msg: "주문 완료" })

        //order_booklist 테이블에 insert
        const [insertOrderList] = await pool.query("INSERT INTO order_booklist (order_quantity, order_price, book_book_id, order_order_id) VALUES(?,?,?,?)", [total_quantity, total_price, book_book_id,order_id])
        res,send({ msg: "주문 내역 생성" })
    } catch (err) {
        console.error(err)
    }
}

/*
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