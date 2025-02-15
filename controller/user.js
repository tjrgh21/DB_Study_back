const pool = require("../DB/db")


exports.getUserList = async (req, res) => {
    const user = req.session.user
    const userInfo = await pool.query("SELECT id, name FROM user WHERE id = ?", [user]);
    res.send(userInfo[0][0]);
};