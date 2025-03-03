const pool = require("../DB/db")

//보유한 쿠폰 불러오기
exports.getCoupon = async (req, res) => {
    const user = req.session.user

    const [allCoupon] = await pool.query("SELECT * FROM coupon WHERE user_id = ? AND used = 0",[user]) //사용가능 쿠폰 조회
    res.send({couponList: allCoupon})
};

//필요하면 사용
//사용한 쿠폰 1로 업데이트
exports.useCoupon = async (req, res) => {
    const user = req.session.user;


    //usedCoupon을 프론트에서 받아오기
    const {usedCoupon} = req.body.couponId;
    console.log("쿠폰 사용: ", usedCoupon)

    try {
        await pool.query("UPDATE coupon SET used = 1 WHERE user_id = ? AND coupon_id =?", [user, usedCoupon]);
        res.send({msg: "쿠폰 사용"})
    } catch (error) {
        console.log("쿠폰 사용 오류")
    }
}