const express=require('express');
const router=express.Router();

const bodyParser=require('body-parser');

const shopController =require('../controllers/shop');
const adminController =require('../controllers/admin');


router.use(bodyParser.urlencoded({extended:true}));

router.get('/login',adminController.loginAsAdmin);

router.get('/',shopController.homePage);
router.get('/home',shopController.homePage);
router.get('/about-us',shopController.about);

router.get('/contact-us',shopController.contactus);
router.post('/contactus',shopController.contactusPost);

router.get('/shop',shopController.shop);

//should wite shop/:details code
router.get('/shop/:productId',shopController.selectedArt);

// personal information and payment are post so cant be reached 
router.post('/personalInformation',shopController.postPersonalInformation);
router.post('/payment',shopController.postPayment);



router.get('/cart',shopController.checkoutArts);

router.post('/checkOrderId',shopController.postCheckOrderId);

router.get('/orderDetails/:orderId',shopController.orderDetails);
router.get('/orderDetailsPayment',shopController.postOrderDetails);

router.post('/addCart',shopController.postAddCart);
router.post('/removeFromCart',shopController.postRemoveFromCart);

router.post('/paymentCallback',shopController.postpaymentCallBack);
router.post('/paymentError',shopController.paymentError);



module.exports=router;