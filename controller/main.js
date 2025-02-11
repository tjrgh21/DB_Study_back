const pool = require("../DB/db")



exports.getMain = async (req, res) => {
    const user = req.session.user
    res.send({user: user})
};