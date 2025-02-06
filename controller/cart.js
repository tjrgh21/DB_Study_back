const pool = require("../DB/db")


exports.postCart = async(req, res) => {
    try{
        const { id } = req.body.id;
        const { date } = req.body.date;
        console.log(id)
        const [ insertCart ] = await pool.query("INSERT INTO cart(user_id, created_date) VALUES(?,?)",[id, date])
        res.send({msg: "장바구니 생성" })
    }
    catch(err){
        console.error(err)
    }
} 