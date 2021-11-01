const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    console.log('inside auth')
    if (!req.headers['authorization']){
        console.log('no jwt in req header')
        res.json({
            'msg' : 'no jwt in req header'
        })
    }
    else{
        let token = req.headers['authorization'];
        token = token.slice(7, token.length);
        console.log('token sliced')
        jwt.verify(token, "secretkey", function(err, decoded) {
            if (err) {
                console.log('error in jwt verify')
                console.log(err);
                res.json({
                    'msg' : `${err}`
                })
            }
            else{
                console.log('decoded: ',decoded);
                res.locals.firstName = decoded.firstName;  
                res.locals.lastName = decoded.lastName;  
                next();
            }
        })
    }
}