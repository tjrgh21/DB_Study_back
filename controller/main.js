const pool = require("../DB/db")



exports.getMain = async (req, res) => {
    const user = req.session.user
    if (!user) {
        return res.status(401).send({ msg: "로그인 안됨" });
    }
    res.send({user: user})
};