const pool = require("../DB/db")

//주문내역
exports.getOrderList = async (req, res) => {
    // const user = req.session.user
    const user = "admin" //임시
    console.log("user:", user)
    const orderId = await pool.query("SELECT order_id FROM \`order\` WHERE user_id = ?", [user])
    console.log("orderID: ", orderId[0][0].order_id)

    const orderBookList = await pool.query("SELECT * FROM order_booklist WHERE order_order_id = ?",[orderId[0][0].order_id]);
    res.send({orderList: orderBookList[0]})
    console.log("주문 내역: ", orderBookList[0][0])
} 