import {
    signUpController,
    loginController,
    protectedController,
} from './controller/controller.js';
import authMiddleware from './services/auth.js';

//import and create router object
import { Router } from 'express';
const router = Router();

router.route('/').get((req, res) => {
    res.render('home');
});

router.route('/home').get((req, res) => {
    res.render('home');
});

router.route('/sign-up').get((req, res) => {
    res.render('sign-up');
});

router.route('/login').get((req, res) => {
    res.render('login');
});

router.route('/logout').get((req, res) => {
    res.clearCookie('jwt-token');
    res.redirect('/login');
});

router.route('/sign-up').post(signUpController);

router.route('/login').post(loginController);

router.route('/protected').get(authMiddleware, protectedController);

export default router;
