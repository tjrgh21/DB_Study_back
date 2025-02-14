const pool = require("../DB/db")

//주문
exports.getOrder = async (req, res) => {
    const user = req.session.user;
    const userCard = await pool.query("SELECT * FROM credit WHERE user_id = ?", [user])
    const userAddress = await pool.query("SELECT * FROM address WHERE user_id = ?", [user])
    console.log(userCard, userAddress)
}