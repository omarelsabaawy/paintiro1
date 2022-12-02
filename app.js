const express=require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const multer = require('multer');

 const MONGODB_URI ='mongodb+srv://paintiro:Y5461145@cluster0.lgt8rls.mongodb.net/test';

const app=express();

const port=3050;

const path=require('path');

const shopRoutes =require('./Routers/shopRoutes');
const adminRoutes =require('./Routers/adminRoutes');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/images',express.static(path.join(__dirname, 'images')));

app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.text({ type: 'text/xml' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use('/',shopRoutes);
app.use('/admin',adminRoutes);

app.use(function(req,res){
  res.status(404).render('../views/pages/404.ejs');
});
app.use(function(req,res){
  res.status(500).render('../views/pages/500.ejs');
});
// app.listen(port);
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(port || process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });
