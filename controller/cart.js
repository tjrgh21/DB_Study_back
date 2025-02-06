const pool = require("../DB/db")


exports.postCart = async(req, res) => {
    try{
        const { id, pw, name } = req.body.user;
        console.log(id)
        const [ insertCart ] = await pool.query("INSERT INTO cart(created_date, user_id) VALUES(NOW(),?)",[id])
        res.send({msg2: "장바구니 생성" })
    }
    catch(err){
        console.error(err)
    }
} 