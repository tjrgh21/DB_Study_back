const pool = require("../DB/db")

exports.getCart = async (req, res) => {
    const user = req.session.user;
    // console.log("유저 정보:", user)
    const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?", [user])
    const userBooks = await pool.query(`
        SELECT cart_book_list_id, book_name, stock, price, book_book_id, cart_cart_id, order_quantity
        FROM cart_booklist a INNER JOIN book b ON a.book_book_id = b.book_id
        WHERE cart_cart_id = ?`, [cartId[0][0].cart_id])
    res.send({ cartList: userBooks[0] })
}

exports.postCartBook = async (req, res) => {
    try {
        const user = req.session.user
        // const quantity = req.body.quantity
        const {oneUpdate, increase, quantity} = req.body
        console.log("body 구성:", req.body)
        const book_id = req.body.book_id
        const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?", [user])
        console.log(`수량: ${quantity}, 사용자: ${user}, 책 id: ${book_id}, 장바구니 id: ${cartId[0][0].cart_id}`)
        
        const bookStock = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_id])
        console.log("책 수량:", bookStock[0][0])
        const stock = bookStock[0][0].stock

        const sameBook = await pool.query("SELECT cart_book_list_id FROM cart_booklist WHERE cart_cart_id = ? AND book_book_id = ?", [cartId[0][0].cart_id, book_id])

        if (sameBook[0].length > 0) {
            const updateQuantity = oneUpdate ? (increase ? 1 : -1) : quantity
            const updateBook = await pool.query("UPDATE cart_booklist SET order_quantity = order_quantity + ? WHERE cart_cart_id = ? AND book_book_id = ?", [updateQuantity, cartId[0][0].cart_id, book_id ])
            res.send({msg: "기존 도서에 추가"})
        } else {
            const insertBook = await pool.query("INSERT INTO cart_booklist(order_quantity, cart_cart_id, book_book_id) VALUES(?,?,?)", [quantity, cartId[0][0].cart_id, book_id])
            res.send({ msg: "장바구니에 도서 추가" })
        }

        
    }
    catch (err) {
        console.error(err)
    }
}

//책 삭제
exports.deleteCartBook = async (req, res) => {
    const cart_book_list_id = req.body.cart_book_list_id; //삭제할 책의 cart_book_list_id
    await pool.query("DELETE FROM cart_booklist WHERE cart_book_list_id = ?", [cart_book_list_id]);
    res.send({ msg: "장바구니에서 삭제" });
    console.log("책 삭제:", cart_book_list_id,"번 째 장바구니 목록")
}
