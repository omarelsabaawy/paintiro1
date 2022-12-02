const express = require('express');
const Product = require('../models/product');
const Message = require('../models/message');
const Order = require('../models/order');
const fileHelper = require('../util/file');

// var LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');




exports.addArt=(req,res,next)=>{
    res.render('../views/pages/admin/addArt.ejs',{
      edit:false
    });
}
exports.loginAsAdmin=(req,res,next)=>{
    res.render('../views/pages/admin/loginAsAdmin.ejs',{
      message:false
    });
}
exports.postAddArt=(req,res,next)=>{
    const image = req.file;

    const name=req.body.name;
    const description=req.body.description;

    const A0price=req.body.A0price;
    const A1price=req.body.A1price;
    const A2price=req.body.A2price;
    const A3price=req.body.A3price;


    if (!image) {
        return res.status(422).render('admin/addArt',{
          edit:false
        });
      }

    const imagePath = image.path;

    const product = new Product({
      title: name,
      description: description,
      A0price:A0price,
      A1price:A1price,
      A2price:A2price,
      A3price:A3price,
      imagePath: imagePath,
    });

    product
    .save()
    .then(result => {
      console.log('');
      res.redirect('../admin');
    })
    .catch(err => {
      res.redirect('../admin/addArt',{edit:false});
      console.log(err);
    });

}

exports.EditArt=(req,res,next)=>{

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.render('../views/pages/admin/addArt.ejs',{
        edit:true,
        product:product
      });
    })
    .catch(err => {
      console.log(err);
     
    });

}

exports.postEditArt=(req,res,next)=>{

  const prodId = req.body.id;
  const updatedImage = req.body.image;

  console.log(updatedImage);
    const updatedName=req.body.name;
    const updatedDescription=req.body.description;

    const updatedA0price=req.body.A0price;
    const updatedA1price=req.body.A1price;
    const updatedA2price=req.body.A2price;
    const updatedA3price=req.body.A3price;


  Product.findById(prodId)
    .then(product => {
      product.title = updatedName;
      product.description = updatedDescription;
      product.imagePath = updatedImage;
      product.A0price = updatedA0price;
      product.A1price = updatedA1price;
      product.A2price = updatedA2price;
      product.A3price = updatedA3price;

      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('../../shop');
      });
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });

}
exports.postDeleteArt= (req,res,next)=>{

  const prodId = req.body.id;
  Product.findById(prodId)
    .then(product => {
      
      fileHelper.deleteFile(product.imagePath);
      return Product.deleteOne({ _id: prodId});
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('../../shop');
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });
}
exports.adminPage=(req,res,next)=>{
    res.render('../views/pages/admin/admin.ejs');
}
exports.ordersTable=(req,res,next)=>{

    Order.find({delivered: false})
    .then(orders => {
      res.render('../views/pages/admin/ordersTable.ejs', {
        orders: orders,
      
      });
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });
}

exports.postshipped=(req,res,next)=>{

  const id = req.body.id;
  Order.findById(id)
    .then(order => {
      order.shipped = true;
      return order.save().then(result => {
        res.redirect('../../admin/ordersTable');
      });
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });

}
exports.postOnTheWay=(req,res,next)=>{

  const id = req.body.id;
  Order.findById(id)
    .then(order => {
      order.shipped = true;
      order.onTheWay = true;
      return order.save().then(result => {
        res.redirect('../../admin/ordersTable');
      });
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });

}
exports.postDelivered=(req,res,next)=>{

  const id = req.body.id;
  Order.findById(id)
    .then(order => {
      order.shipped = true;
      order.onTheWay = true;
      order.delivered = true;
      return order.save().then(result => {
        res.redirect('../../admin/ordersTable');
      });
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });

}


exports.messagesTable=(req,res,next)=>{
  Message.find()
  .then(messages => {
    res.render('../views/pages/admin/messages.ejs', {
      messages: messages,
    
    });
  })
  .catch(err => {
    res.render('../views/pages/500.ejs');
  });

}

exports.postDeleteMessage=(req,res,next)=>{
  const messageId = req.body.id;

  Message.findById(messageId)
    .then(message => {

      return message.deleteOne({ _id: messageId});
    })
    .then(() => {
      
      res.redirect('../../admin/messages');
    })
    .catch(err => {
      res.render('../views/pages/500.ejs');
    });

}

//login as admin
exports.postloginAsAdmin=(req,res,next)=>{

  const email=req.body.email;
  const password=req.body.password;


  if(email=="paintiro@paintiro.com" && password =="1009099"){

    // localStorage.setItem("admin", "2110100");
    res.cookie('admin', '2110100');
    res.redirect('../admin');
  }else{
    res.render('../views/pages/admin/loginAsAdmin.ejs',{
      message:true
    });
  }


}
//logout as admin
exports.postlogoutAsAdmin=(req,res,next)=>{
  console.log("yess");
  // localStorage.setItem("admin", "");
  res.cookie('admin', '')
  res.redirect('../shop');
}
