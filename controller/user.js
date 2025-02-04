const pool = require("../DB/db")


exports.getUserList = async (req, res) => {
    const user = req.session.user
    const userList = await pool.query("SELECT * FROM user")
    res.send(userList[0])
};