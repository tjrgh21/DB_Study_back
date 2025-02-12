const pool = require("../DB/db")

//카드, 주소 조회
exports.getMyPage = async (req, res) => {    
    try {
        const user = req.session.user //세션에서 유저 가져오기
        console.log(user)

        // const userInfo = await pool.query("SELECT * FROM user WHERE id = ?", [user])
        const card = await pool.query("SELECT * FROM card WHERE user_id = ?", [user])
        const address = await pool.query("SELECT * FROM address WHERE user_id = ?", [user])
        
        if (card.length > 0 && address.length > 0) { //[]을 써야하나? 학교가서 테스트
            res.send({card: card, address: address})
        } else if (card.length > 0) {
            res.send({msg: "등록된 카드 없음"})
        } else if (address.length > 0) {
            res.send({msg: "등록된 주소 없음"})
        } else {
            res.send({msg: "정보 없음"})
        }
    } catch {
        console.log("오류")
        res.send({msg: "오류"})
    }
};

//카드 추가
exports.postCard = async (req, res) => {
    const {cardNumber, cardExpiration, cardCompany} = req.body.card //DB 이름이랑 같게 통일
    console.log(`카드번호: ${cardNumber}, 카드 유효기간: ${cardExpiration}, 카드사: ${cardCompany}`)

    const user = req.session.user

    const addCard = await pool.query("INSERT INTO card VALUES(?,?,?)", [cardNumber, cardExpiration, cardCompany]) //DB 이름이랑 같게 통일
    res.send({msg: "카드 추가"})
}

//카드 삭제
exports.deleteCard = async (req, res) => {
    const cardNumber = req.body.cardNumber; //삭제할 카드의 cardNumber
    await pool.query("DELETE FROM card WHERE cardNumber = ?", [cardNumber]);
    res.send({ msg: "카드 목록에서 삭제" });
    console.log("카드 삭제:", cardNumber, "번 째 카드")
}

//주소 추가
exports.postAddress = async (req, res) => {
    const {zipCode, basicAddr, detailAddr} = req.body.address
    console.log(`우편번호: ${zipCode}, 기본주소: ${basicAddr}, 상세주소: ${detailAddr}`) //DB 이름이랑 같게 통일

    const user = req.session.user

    const addAddress = await pool.query("INSERT INTO address VALUES(?,?,?)", [zipCode, basicAddr, detailAddr]) //DB 이름이랑 같게 통일
    res.send({msg: "주소 추가"})
}

//주소 삭제
exports.deleteAddress = async (req, res) => {
    const zipCode = req.body.zipCode; //삭제할 주소의 zipCode
    await pool.query("DELETE FROM address WHERE zipCode = ?", [zipCode]);
    res.send({ msg: "주소 목록에서 삭제" });
    console.log("우편번호: ", zipCode, " 주소 삭제")
}