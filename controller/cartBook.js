const pool = require("../DB/db")


exports.postCartBook = async(req, res) => {
    try{
        const user = req.session.user
        const quantity = req.body.quantity
        const book_id = req.body.book_id
        const cart_id = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?",[user])
        console.log(cart_id)
        const [ insertBook ] = await pool.query("INSERT INTO cart_booklist(order_quantity, cart_id, book_id) VALUES(?,?,?)",[quantity, cart_id, book_id])
        res.send({msg: "장바구니에 도서 추가" })
    }
    catch(err){
        console.error(err)
    }
} 