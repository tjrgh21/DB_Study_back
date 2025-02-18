const pool = require("../DB/db")

//주문내역
exports.getOrderList = async (req, res) => {
    const user = req.session.user
    // const user = "admin" //임시
    console.log("현재 유저:", user)
    // const orderId = await pool.query("SELECT order_id FROM \`order\` WHERE user_id = ?", [user])
    // console.log("orderID: ", orderId[0][0].order_id)
    const [orders] = await pool.query("SELECT * FROM `order` WHERE user_id = ?", [user]);
    // console.log("orders: ", orders)

    const ordersWithBooks = await Promise.all(
        orders.map(async (order) => {
            const [orderBookList] = await pool.query(
                "SELECT * FROM order_booklist WHERE order_order_id = ?",
                [order.order_id]
            );
            // console.log("orderBookList: ", orderBookList)

            return {
                order_id: order.order_id,
                order_date: order.order_date,
                total_price: order.total_price,
                books: orderBookList // 해당 주문에 대한 책 목록
            };
        })
    );

    res.send({ orderList: ordersWithBooks });

    // const orderBookList = await pool.query("SELECT * FROM order_booklist WHERE order_order_id = ?",[orderId[0][0].order_id]);
    // res.send({orderList: orderBookList[0]})
    // console.log(
    //     "orderBookList 데이터:", orderBookList,
    //     "주문 내역 ID: ", orderBookList[0][0].order_booklist_id,
    //     "주문 수량: ", orderBookList[0][0].order_quantity,
    //     "주문 가격: ", orderBookList[0][0].order_price,
    //     "주문 도서 ID: ", orderBookList[0][0].book_book_id,
    //     "주문 ID: ", orderBookList[0][0].order_order_id
    // ); //콘솔 찍기
}

exports.getOrderDetail = async (req, res) => {
    const { order_id } = req.params;
    console.log("받은 order_id:", order_id);

    const [order] = await pool.query("SELECT * FROM `order` WHERE order_id = ?", [order_id]);
    console.log("받은 order:", order);

    if (!order) {
        return res.status(404).send("주문을 찾을 수 없습니다.");
    }

    // 해당 주문 ID에 해당하는 책 목록과 책 이름 가져오기
    const [orderBookList] = await pool.query(`
        SELECT a.order_booklist_id, a.order_quantity, a.order_price, b.book_name
        FROM order_booklist a
        JOIN book b ON a.book_book_id = b.book_id
        WHERE a.order_order_id = ?`, [order_id]);

    if (!orderBookList || orderBookList.length === 0) {
        return res.status(404).send("주문 책 목록을 찾을 수 없습니다.");
    }

    const orderDetail = {
        order_id: order[0].order_id,
        order_date: order[0].order_date, 
        total_price: order[0].total_price,
        books: orderBookList
    };

    console.log("orderDetail:", orderDetail);  // 응답되는 데이터 확인

    res.send({ orderDetail });
};