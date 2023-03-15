import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import loginSchema from '../services/validation.js';

dotenv.config();

const createJWT = (payload) => {
    console.log('in createJWT');
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: 120,
    });
    console.log(token);
    return token;
};

//server side error handling for request body
const handleErrors = (err) => {
    console.log('inside handleErrors');
    console.log(JSON.stringify(err));
    const formattedError = { username: '', password: '' };
    err.forEach(
        (singleErr) => (formattedError[singleErr.path[0]] = singleErr.message)
    );
    console.log('formatted errors: ', formattedError);
    return formattedError;
};

const signUpController = async (req, res) => {
    try {
        console.log('in signUpController');
        const { username, password } = req.body;
        console.log(username, password);

        //validaton for request body
        const validUserData = loginSchema.validate(
            //this is the sync method, we can also use the validateAsync method
            {
                username, //obj to validate against the schema
                password,
            },
            { abortEarly: false } //joi validation option to allow validation to continue for covering all errors
        );
        console.log('validUserData: ', validUserData);
        if (validUserData.error) {
            console.log('joi error');
            const formattedErrors = handleErrors(validUserData.error.details);
            res.status(400).json({ errors: formattedErrors });
        } else if (validUserData && validUserData.value) {
            //hashing password for storing in db
            const hashedPassword = await bcrypt.hash(
                validUserData.value.password,
                10
            );
            const newUserInDB = await User.create({
                username: validUserData.value.username,
                password: hashedPassword,
            });
            console.log('new user created: ', newUserInDB);
            //make jwt using user id
            if (newUserInDB && newUserInDB._id) {
                const token = createJWT({ userId: newUserInDB._id.toString() });
                //jwt saved in cookie for future use
                res.cookie('jwt-token', token, { httpOnly: true });
                res.status(201).json({ userId: newUserInDB._id });
            }
        }
    } catch (err) {
        console.log('error in signUp');
        console.log(err);
        if (err.code === 11000) {
            res.status(400).json({
                errors: {
                    username: 'Username already exits. Give other username',
                },
            });
        }
    }
};

const loginController = async (req, res) => {
    try {
        console.log('in loginController');
        const { username, password } = req.body;

        //validaton for request body
        const validUserData = loginSchema.validate(
            //this is the sync method, we can also use the validateAsync method
            {
                username, //obj to validate against the schema
                password,
            },
            { abortEarly: false } //joi validation option to allow validation to continue for covering all errors
        );
        console.log('validUserData: ', validUserData);
        if (validUserData.error) {
            console.log('joi error');
            const formattedErrors = handleErrors(validUserData.error.details);
            res.status(400).json({ errors: formattedErrors });
        }

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
                res.status(200).json({ userId: foundUser._id });
            } else {
                //wrong password
                res.status(401).json({
                    errors: { password: 'Wrong password' },
                });
            }
        } else {
            //Username not found in db
            res.status(401).json({
                errors: { username: 'Username not found' },
            });
        }
    } catch (err) {
        console.log('error in loginController');
        console.log(err);
    }
};

const protectedController = async (req, res) => {
    try {
        console.log('inside protectedController');
        const userId = req.decodedId;

        //case1: searching user
        const foundUser = await User.findById(userId).exec();
        console.log('foundUser: ', foundUser);
        if (foundUser) {
            res.render('protected', { user: foundUser });
        } else {
            console.log(`user id :${userId} not found in db`);
        }
    } catch (err) {
        console.log('error in protectedController');
        console.log(err);
    }
};

export { signUpController, loginController, protectedController };
