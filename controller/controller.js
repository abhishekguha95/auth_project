//import jwt from 'jsonwebtoken';

// exports.first = (req, res) => {
//     console.log('inside first');
//     const { firstName, lastName } = req.body;
//     const token = jwt.sign(
//         { firstName: firstName, lastName: lastName },
//         'secretkey',
//         { expiresIn: 120 }
//     );
//     console.log('jwt: ', token);
//     res.json({
//         jwt: `${token}`,
//     });
// };

// exports.second = (req, res) => {
//     console.log('inside second');
//     res.json({
//         msg: 'success',
//         firstName: `${res.locals.firstName}`,
//         lastName: `${res.locals.lastName}`,
//     });
// };

import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createJWT = (payload) => {
    console.log('in createJWT');
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 120,
    });
    console.log(token);
    return token;
};

const signUpController = async (req, res) => {
    try {
        console.log('in signUpController');
        const { username, password } = req.body;
        console.log(username, password);

        //hashing password for storing in db
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserInDB = await User.create({
            username,
            password: hashedPassword,
        });
        console.log(newUserInDB);

        //make jwt using user id
        if (newUserInDB && newUserInDB._id) {
            const token = createJWT({ userId: newUserInDB._id.toString() });

            //jwt saved in cookie for future use
            res.cookie('jwt-token', token, { httpOnly: true });
        }
        res.status(201).json({
            msg: 'new user created',
            user: newUserInDB,
        });
    } catch (err) {
        console.log('error in signUp');
        console.log(err);
        res.json({ err });
    }
};

const loginController = async (req, res) => {
    console.log('in loginController');
    const { username, password } = req.body;

    //case1: searching email
    const foundUser = await User.findOne({ username }).exec();
    console.log('foundUser: ', foundUser);
    if (foundUser) {
        //verifying password
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            //password matched
            const token = createJWT({ userId: foundUser._id });

            //jwt saved in cookie for future use
            res.cookie('jwt-token', token, { httpOnly: true });
            res.render('protected');
        } else {
            //wrong password
            res.status(401).json({ message: 'Wrong password' });
        }
    } else {
        //email not found in db
        res.status(401).json({ message: 'Email not found' });
    }
};

const protectedController = (req, res) => {
    console.log('inside protectedController');
    res.render('protected');
};

export { signUpController, loginController, protectedController };
