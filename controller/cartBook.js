const pool = require("../DB/db")

exports.getCart = async(req, res) => {
    const user = req.session.user;
    const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?",[user])
    const userBooks = await pool.query(`
        SELECT cart_book_list_id, book_name, stock, price, book_book_id, cart_cart_id, order_quantity
        FROM cart_booklist a INNER JOIN book b ON a.book_book_id = b.book_id
        WHERE cart_cart_id = ?`,[cartId[0][0].cart_id])
        res.send(userBooks[0])
}

exports.postCartBook = async(req, res) => {
    try{
        const user = req.session.user
        const quantity = req.body.quantity
        const book_id = req.body.book_id
        const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?",[user])
        console.log(`수량: ${quantity}, 사용자: ${user}, 책 id: ${book_id}, 장바구니 id: ${cartId[0][0].cart_id}`)
        const [ insertBook ] = await pool.query("INSERT INTO cart_booklist(order_quantity, cart_cart_id, book_book_id) VALUES(?,?,?)",[quantity, cartId[0][0].cart_id, book_id])
        res.send({msg: "장바구니에 도서 추가" })
    }
    catch(err){
        console.error(err)
    }
} 