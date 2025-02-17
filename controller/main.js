const pool = require("../DB/db")



exports.getMain = async (req, res) => {
    const user = req.session.user || null
    res.send({user: user})
};