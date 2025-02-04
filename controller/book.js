const pool = require("../DB/db")


exports.getBookList = async (req, res) => {
    const user = req.session.user
    const bookList = await pool.query("SELECT * FROM book")
    res.send({user: user, list:bookList[0]})
};