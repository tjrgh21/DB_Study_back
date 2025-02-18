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

//front, back 작업 체인지 후 코드 --------------------------------------

const mypage = require('../controller/mypage')
const order = require('../controller/order')
const orderList = require('../controller/orderList')

//여기까지 --------------------------------------------------------------

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

//front, back 작업 체인지 후 코드 --------------------------------------

router.post('/deleteCartBook', cartBook.deleteCartBook);

//mypage
router.get('/mypage', mypage.getMyPage) //마이페이지 조회
router.post('/credit', mypage.postCredit); //카드 추가
router.post('/deleteCard', mypage.deleteCard); //카드 삭제
router.post('/address', mypage.postAddress); //주소 추가
router.post('/deleteAddress', mypage.deleteAddress); //주소 삭제

router.post('/updateCartQuantity', cartBook.updateCartQuantity); //장바구니에서 수량 업데이트
router.post('/order', order.postOrder); //주문하기
router.get('/orderBookList', orderList.getOrderList); //주문내역
router.get('/orderDetail/:order_id', orderList.getOrderDetail);

//여기까지 --------------------------------------------------------------


module.exports = router;