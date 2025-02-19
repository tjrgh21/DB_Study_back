const pool = require("../DB/db")


exports.getCoupon = async (req, res) => {
    const user = req.session.user
    // const user = "admin"
    const [allCoupon] = await pool.query("SELECT * FROM coupon WHERE user_id = ? AND used = 0",[user]) //사용가능 쿠폰 조회
    // console.log("보유 쿠폰: ", allCoupon)

    // try {
    // const [couponId] = await pool.query("SELECT coupon_id FROM coupon WHERE user_id = ? AND used = 1",[user])
    // console.log("선택한 coupon ID: ", couponId[0].coupon_id)

    // const [selectCoupon] = await pool.query("SELECT * FROM coupon WHERE coupon_id = ?",[couponId[0].coupon_id])
    // console.log("선택한 쿠폰 정보: ", selectCoupon[0])
    // } catch {
    //     console.log("선택된 쿠폰 없음")
    // }

    res.send({couponList: allCoupon})
};

// exports.selectCoupon = async (req, res) => {
//     const { selectedCouponId } = req.body;
//     console.log("선택한 쿠폰 id: ",selectedCouponId)
//     const user = req.session.user
//     // const user = "admin";

//     try {
//         //선택한 쿠폰만 selected = 1, 나머지는 모두 0으로 바꾸기
//         await pool.query("UPDATE coupon SET selected = 1 WHERE user_id = ? AND coupon_id = ?",[user, selectedCouponId]);
//         await pool.query("UPDATE coupon SET selected = 0 WHERE user_id = ? AND coupon_id != ?",[user, selectedCouponId]);

//         res.send({ msg: "쿠폰 선택" });
//     } catch (error) {
//         console.error("쿠폰 선택 오류: ", error);
//     }
// };

// exports.deselectCoupon = async (req, res) => {
//     const user = req.session.user;

//     try {
//         await pool.query("UPDATE coupon SET selected = 0 WHERE user_id = ?",[user])

//         res.send({msg: "쿠폰 선택 안함"})
//         console.log("쿠폰 사용 취소")
//     } catch (error) {
//         console.log("쿠폰 선택 취소 오류: ", error)
//     }
// }