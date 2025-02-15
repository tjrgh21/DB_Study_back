const pool = require("../DB/db")

//카드, 주소 조회
exports.getMyPage = async (req, res) => {
    try {
        const user = req.session.user; //세션에서 유저 가져오기
        console.log("세션 정보:", req.session)
        console.log("유저 정보:", user)

        const userInfo = await pool.query("SELECT id, name FROM user WHERE id = ?", [user]);
        console.log("유저 정보 쿼리: ", userInfo);
        const card = await pool.query("SELECT * FROM credit WHERE user_id = ?", [user])
        const address = await pool.query("SELECT * FROM address WHERE user_id = ?", [user])
        console.log("카드 쿼리: ", card, "주소 쿼리: ", address)

        res.send({ user : userInfo[0][0], card: card[0], address: address[0] })

        // if (card[0].length > 0 && address[0].length > 0) {
        //     res.send({ card: card, address: address })
        // } else if (card[0].length > 0) {
        //     res.send({ msg: "등록된 카드 없음" })
        // } else if (address[0].length > 0) {
        //     res.send({ msg: "등록된 주소 없음" })
        // } else {
        //     res.send({ msg: "정보 없음" })
        // }
    } catch {
        console.log("오류")
        res.send({ msg: "오류" })
    }
};

//카드 추가
exports.postCredit = async (req, res) => {
    const { card_id, expiration_date, card_company } = req.body.credit
    console.log(`카드번호: ${card_id}, 카드 유효기간: ${expiration_date}, 카드사: ${card_company}`)

    const user = req.session.user

    const addCard = await pool.query("INSERT INTO credit VALUES(?,?,?,?)", [card_id, expiration_date, card_company, user])
    res.send({ msg: "카드 추가" })
}

//카드 삭제
exports.deleteCard = async (req, res) => {
    const card_id = req.body.card_id; //삭제할 카드의 card_id
    const user = req.session.user
    await pool.query("DELETE FROM credit WHERE card_id = ? AND user_id = ?", [card_id, user]);
    res.send({ msg: "카드 목록에서 삭제" });
    console.log("카드 삭제:", card_id, "번 째 카드")
}

//주소 추가
exports.postAddress = async (req, res) => {
    const { postal_code, address, detailed_address } = req.body.address
    console.log(`우편번호: ${postal_code}, 기본주소: ${address}, 상세주소: ${detailed_address}`)

    const user = req.session.user

    const addAddress = await pool.query("INSERT INTO address(postal_code, address, detailed_address, user_id) VALUES(?,?,?,?)", [postal_code, address, detailed_address, user])
    res.send({ msg: "주소 추가" })
}

//주소 삭제
exports.deleteAddress = async (req, res) => {
    const user = req.session.user
    const address_id = req.body.address_id; //삭제할 주소의 postal_code
    await pool.query("DELETE FROM address WHERE address_id = ? AND user_id =?", [address_id, user]);
    res.send({ msg: "주소 목록에서 삭제" });
    console.log("주소 삭제: ", address_id, "번 째 주소")
}

// //주문내역
// exports.orderBookList = async (req, res) => {
//     const user = req.session.user
//     await pool.query("DELETE FROM address WHERE address_id = ? AND user_id =?", [address_id, user]);
// }
