import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        console.log('in authMiddleware');

        //taking jwt from request cookie
        const jwtoken = req.cookies['jwt-token'];

        //jwt verification
        jwt.verify(jwtoken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('error in jwt verify');
                console.log(err);
                res.json({
                    msg: `${err}`,
                });
            } else {
                console.log('decoded: ', decoded);
                next();
            }
        });
    } catch (err) {
        console.log('error in authMiddleware');
        console.log(err);
        res.redirect('/login');
    }
};

export default authMiddleware;
