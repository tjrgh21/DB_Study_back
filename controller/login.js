const pool = require("../DB/db")

exports.postLogin = async(req, res) => {

    try{
        const {id, pw} = req.body.user;
        const [ checkUser ] = await pool.query("SELECT * FROM user WHERE id =? AND pw = ?",[id, pw]);
        console.log(checkUser)
        if(checkUser.length > 0){
            req.session.user = id
            req.session.save()
            // console.log(req.session)
            console.log("로그인: ", req.session.user)
            res.send({msg: "로그인 되었습니다."})
        }
        else{
            res.send({msg: "존재하지 않는 사용자입니다."})
        }
    }
    catch(err){
        console.error(err)
    }
    
};