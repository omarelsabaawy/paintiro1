const express=require('express');
const router=express.Router();

const bodyParser=require('body-parser');

const adminController =require('../controllers/admin');

const isAdmin = require('../middleware/is-admin');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/',isAdmin,adminController.adminPage);

router.get('/addArt',isAdmin,adminController.addArt);
router.post('/addArt',isAdmin,adminController.postAddArt);

router.post('/edit/:productId',isAdmin,adminController.EditArt);
router.post('/editArt',isAdmin,adminController.postEditArt);

router.post('/deleteArt',isAdmin,adminController.postDeleteArt);

// router.post('/deleteArt',adminController.postDeleteArt);

router.get('/ordersTable',isAdmin,adminController.ordersTable);
router.post('/shipped',isAdmin,adminController.postshipped);
router.post('/onTheWay',isAdmin,adminController.postOnTheWay);
router.post('/delivered',isAdmin,adminController.postDelivered);
router.get('/messages',isAdmin,adminController.messagesTable);
router.post('/deleteMessage',isAdmin,adminController.postDeleteMessage);

router.post('/loginAsAdmin',adminController.postloginAsAdmin);
router.post('/logoutAsAdmin',adminController.postlogoutAsAdmin);

module.exports=router;