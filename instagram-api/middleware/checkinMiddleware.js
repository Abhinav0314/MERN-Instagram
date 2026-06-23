const checkin = (req,res,next)=>{
    if (req.body.material ==="Bomb"){
        return res.status(403).json({"message":"Cannot check in Bombs"})
    }
    next();
}

module.exports = checkin