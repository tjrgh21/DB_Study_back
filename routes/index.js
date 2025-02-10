const express = require('express');
const router = express.Router();
//사용할 컨트롤러 선언

const book = require('../controller/book')
const login = require('../controller/login')
const logout = require('../controller/logout')
const main = require('../controller/main')
const state = require("../controller/state")
const user = require('../controller/user')
const signUp = require('../controller/signUp')
const cart = require('../controller/cart')
const cartBook = require('../controller/cartBook')



router.get('/', main.getMain);
router.get('/book', book.getBookList);
router.post("/login", login.postLogin)//로그인 post 요청
router.post("/logout", logout.postLogout)
router.get("/state", state.getState);
router.get("/user", user.getUserList);
router.post('/signup',signUp.postSignUp);
router.post('/cart',cart.postCart);
router.get('/cartBook',cartBook.getCart);
router.post('/cartBook',cartBook.postCartBook);

module.exports = router;