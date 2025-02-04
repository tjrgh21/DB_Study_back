const pool = require("../DB/db")

/*헤더로 로그인 상태를 보내주는 컨트롤러 */

exports.getState = async (req, res) => {
    const user = req.session.user;
    res.send(user)
};