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

// exports.postCartBook = async (req, res) => {
//     try {
//         const user = req.session.user
//         // const quantity = req.body.quantity
//         const {oneUpdate, increase, quantity} = req.body
//         console.log("body 구성:", req.body)
//         const book_id = req.body.book_id
//         const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?", [user])
//         console.log(`수량: ${quantity}, 사용자: ${user}, 책 id: ${book_id}, 장바구니 id: ${cartId[0][0].cart_id}`)

//         const bookStock = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_id])
//         console.log("책 수량:", bookStock[0][0])
//         const stock = bookStock[0][0].stock

//         const sameBook = await pool.query("SELECT cart_book_list_id FROM cart_booklist WHERE cart_cart_id = ? AND book_book_id = ?", [cartId[0][0].cart_id, book_id])

//         if (sameBook[0].length > 0) {
//             const updateQuantity = oneUpdate ? (increase ? 1 : -1) : quantity
//             const updateBook = await pool.query("UPDATE cart_booklist SET order_quantity = order_quantity + ? WHERE cart_cart_id = ? AND book_book_id = ?", [updateQuantity, cartId[0][0].cart_id, book_id ])
//             res.send({msg: "기존 도서에 추가"})
//         } else {
//             const insertBook = await pool.query("INSERT INTO cart_booklist(order_quantity, cart_cart_id, book_book_id) VALUES(?,?,?)", [quantity, cartId[0][0].cart_id, book_id])
//             res.send({ msg: "장바구니에 도서 추가" })
//         }


//     }
//     catch (err) {
//         console.error(err)
//     }
// }

// exports.postCartBook = async (req, res) => {
//     try {
//         const user = req.session.user
//         const { cart_book_list_id, book_id, quantity, increase } = req.body
//         console.log(req.body)
//         console.log(cart_book_list_id, book_id, quantity)
//         const bookStock = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_id])
//         console.log("재고량: ", bookStock[0][0].stock)
//         const cartId = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?", [user])
//         console.log("장바구니 id: ", cartId[0][0].cart_id)

//         const sameBook = await pool.query("SELECT cart_book_list_id FROM cart_booklist WHERE cart_cart_id = ? AND book_book_id = ?", [cartId[0][0].cart_id, book_id])
//         console.log(sameBook)

//         const existingQuantity = await pool.query("SELECT order_quantity FROM cart_booklist WHERE cart_book_list_id = ? AND book_book_id = ?", [cart_book_list_id, book_id])
//         console.log("현재 구매수량: ", existingQuantity[0][0])
//         // const resultExistingQuantity = existingQuantity[0][0].order_quantity

//         const plusMinus = increase ? 1 : -1
//         await pool.query("UPDATE cart_booklist SET order_quantity = order_quantity + ? WHERE cart_cart_id = ? AND book_book_id = ?",
//             [plusMinus, cartId[0][0].cart_id, book_id])
//         res.send({ msg: "장바구니 수량 수정" })
//     }
//     catch (err) {
//         console.error(err)
//     }
// }
exports.postCartBook = async (req, res) => {
    try {
        const user = req.session.user;
        console.log("현재 로그인 사용자: ", user)
        const { book_id, quantity } = req.body;
        console.log("책 id: ", book_id, "책 수량: ", quantity)
        const [cart] = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?", [user]);
        const cartId = cart[0].cart_id; //장바구니 아이디

        //같은 책이 있는지 체크
        const [existingBook] = await pool.query("SELECT order_quantity FROM cart_booklist WHERE cart_cart_id = ? AND book_book_id = ?", [cartId, book_id]);

        //재고량
        const [bookStock] = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_id]);

        const stock = bookStock[0].stock;

        if (existingBook.length > 0) { //이미 장바구니에 있으면, 거기에 추가(재고량 못 넘음)
            let newQuantity = existingBook[0].order_quantity + quantity; //이거 const로 바꾸면 오류남
            if (newQuantity > stock)
                {newQuantity = stock};

            await pool.query("UPDATE cart_booklist SET order_quantity = ? WHERE cart_cart_id = ? AND book_book_id = ?",[newQuantity, cartId, book_id]);
        } else {
            //장바구니에 없으면 새로 추가
            const addQuantity = quantity > stock ? stock : quantity;
            await pool.query(
                "INSERT INTO cart_booklist (cart_cart_id, book_book_id, order_quantity) VALUES (?, ?, ?)",[cartId, book_id, addQuantity]);
        }
        res.send({msg: "장바구니 업데이트"});
    } catch {
        console.error("서버 오류");
        res.send({ msg: "서버 오류" });
    }
};

exports.updateCartQuantity = async (req, res) => {
    try {
        const user = req.session.user;
        console.log("현재 로그인 사용자: ", user)
        const { book_id, quantity, increase } = req.body;
        console.log("책 id: ", book_id, "책 수량: ", quantity)
        const [cart] = await pool.query("SELECT cart_id FROM cart WHERE user_id = ?", [user]);
        const cartId = cart[0].cart_id; //장바구니 아이디

        //현재 장바구니에 담긴 책 수량 가져오기
        const [existingBook] = await pool.query("SELECT order_quantity FROM cart_booklist WHERE cart_cart_id = ? AND book_book_id = ?",[cartId, book_id]);
        if (existingBook.length === 0) {
            res.send({ msg: "장바구니 해당 책이 없습니다." });
        }

        let currentQuantity = existingBook[0].order_quantity;

        //재고량
        const [bookStock] = await pool.query("SELECT stock FROM book WHERE book_id = ?", [book_id]);
        const stock = bookStock[0].stock;

        //수량 업데이트
        if (increase) {
            if (currentQuantity < stock) {
                currentQuantity += 1;
            } else {
                res.send({ msg: `최대 수량(${stock}개)까지 추가 가능` });
            }
        } else {
            if (currentQuantity > 1) {
                currentQuantity -= 1;
            } else {
                return res.send({ msg: "최소 수량 1개" });
            }
        }

        //DB 업데이트
        await pool.query("UPDATE cart_booklist SET order_quantity = ? WHERE cart_cart_id = ? AND book_book_id = ?",[currentQuantity, cartId, book_id]);

        res.send({ msg: "수량 업데이트 완료", newQuantity: currentQuantity });
    } catch {
        console.error("서버 오류");
        res.send({ msg: "서버 오류" });
    }
};


//책 삭제
exports.deleteCartBook = async (req, res) => {
    const cart_book_list_id = req.body.cart_book_list_id; //삭제할 책의 cart_book_list_id
    await pool.query("DELETE FROM cart_booklist WHERE cart_book_list_id = ?", [cart_book_list_id]);
    res.send({ msg: "장바구니에서 삭제" });
    console.log("책 삭제:", cart_book_list_id, "번 째 장바구니 목록")
}
