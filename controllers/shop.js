const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const Message = require("../models/message");
var request = require("request");

// var nodemailer = require('nodemailer');
// const { MailtrapClient } = require("mailtrap");

// var LocalStorage = require("node-localstorage").LocalStorage;
// localStorage = new LocalStorage("./scratch");

exports.homePage = (req, res, next) => {
  res.render("../views/pages/index.ejs");
};
exports.about = (req, res, next) => {
  res.render("../views/pages/about.ejs");
};

exports.shop = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("../views/pages/shop.ejs", {
        products: products,
      });
    })
    .catch((err) => {
      res.render("../views/pages/500.ejs");
    });
};

exports.selectedArt = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      // admin = localStorage.getItem("admin");
      admin=req.cookies.admin;

      console.log(admin);
      if (admin == "2110100") {
        res.render("../views/pages/selectedArt.ejs", {
          product: product,
          admin: true,
        });
      } else {
        res.render("../views/pages/selectedArt.ejs", {
          product: product,
          admin: false,
        });
      }
    })
    .catch((err) => {
      res.render("../views/pages/500.ejs");
    });
};

exports.contactus = (req, res, next) => {
  res.render("../views/pages/contact.ejs");
};
exports.contactusPost = (req, res, next) => {
  const date = new Date();
  const message = new Message({
    date: date.toString(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    subject: req.body.subject,
    Message: req.body.message,
  });

  message
    .save()
    .then((result) => {
      res.render("../views/pages/index.ejs");
    })
    .catch((err) => {
      res.render("../views/pages/contact.ejs");
    });
};

exports.postPersonalInformation = (req, res, next) => {
  res.render("../views/pages/personalInformation.ejs");
};

// NOT WORK

/////////////////////////////// payment

exports.postPayment = (req, res, next) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var phoneNumber = req.body.phoneNumber;
  var city = req.body.city;
  var street = req.body.street;
  var BuildingNumber = req.body.BuildingNumber;
  var floorNumber = req.body.floorNumber;
  var apartmentNumber = req.body.apartmentNumber;
  var address = req.body.address;

  var perInfArray = [
    firstName,
    lastName,
    email,
    phoneNumber,
    city,
    street,
    BuildingNumber,
    floorNumber,
    apartmentNumber,
    address,
  ];
  // const jsonpersonalInformationArr = JSON.stringify(perInfArray); // store not normal array
  // localStorage.setItem("personalInformation", jsonpersonalInformationArr);
  const jsonpersonalInformationArr = JSON.stringify(perInfArray);
  res.cookie('personalInformation', jsonpersonalInformationArr); 

  // cartArray = localStorage.getItem("cart");
  // const parsedArr = JSON.parse(cartArray);
  var cartArray =req.cookies.cart;
  parsedArr =JSON.parse(cartArray); //==>

  var price = 0;
  var check = 1;

  for (let i = 0; i < parsedArr.length; i++) {
    Product.findById(parsedArr[i][0])
      .then((p) => {
        if (parsedArr[i][1] == "A0Price") {
          price += parsedArr[i][2] * p.A0price;
        } else if (parsedArr[i][1] == "A1Price") {
          price += parsedArr[i][2] * p.A1price;
        } else if (parsedArr[i][1] == "A2Price") {
          price += parsedArr[i][2] * p.A2price;
        } else if (parsedArr[i][1] == "A3Price") {
          price += parsedArr[i][2] * p.A3price;
        }
        return price;
      })
      .then(async (price) => {
        if (check == parsedArr.length) {
          var apiKey =
            "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsSWpvaWFXNXBkR2xoYkNJc0ltTnNZWE56SWpvaVRXVnlZMmhoYm5RaUxDSndjbTltYVd4bFgzQnJJam8yTXpjMU5EQjkuOUxZdzNubDE5anlTUFFlT09UVXN3MHZVQzVUWWZTTFM4NHlBN1FpaTZpVHF0QkRPdDJKYXZKOU1ZZ1Q0cHk5eF9lRUNqSEt0a3hEWmJkMWVjNGpYc0E=";
          // step one payment
          new Promise((resolve, reject) => {
            request.post(
              "https://accept.paymob.com/api/auth/tokens",
              { json: { api_key: apiKey } },
              function (error, response, body) {
                console.log(response.statusCode);
                if (!error && response.statusCode == 201) {
                  // resolve(body.token);

                  //step two payment
                  new Promise((resolve, reject) => {
                    request.post(
                      "https://accept.paymob.com/api/ecommerce/orders",
                      {
                        json: {
                          auth_token: body.token,
                          delivery_needed: false,
                          amount_cents: price * 100 + 150 * 100,
                          // amount_cents: 100,
                          items: [],
                        },
                      },
                      function (error, response1, body1) {
                        console.log(response1.statusCode);
                        if (!error && response1.statusCode == 201) {
                          //step three payment

                          new Promise((resolve, reject) => {
                            request.post(
                              "https://accept.paymob.com/api/acceptance/payment_keys",
                              {
                                json: {
                                  auth_token: body.token,
                                  amount_cents: price * 100 + 150 * 100,
                                  // amount_cents: 100,
                                  expiration: 7200,
                                  order_id: body1.id,
                                  merchant_order_id: 5,
                                  billing_data: {
                                    email: email,
                                    first_name: firstName,
                                    phone_number: phoneNumber,
                                    last_name: lastName,
                                    apartment: "NA",
                                    floor: "NA",
                                    street: "NA",
                                    building: "NA",
                                    shipping_method: "NA",
                                    postal_code: "NA",
                                    city: city,
                                    country: "Egypt",
                                    state: city,
                                  },
                                  currency: "EGP",
                                  integration_id: 3125907,
                                },
                              },

                              function (error, response2, body2) {
                                console.log(response2.statusCode);
                                if (!error && response2.statusCode == 201) {
                                  var iframeToken = body2.token;
                                  console.log();
                                  res.render("../views/pages/payment.ejs", {
                                    price: price + 150,
                                    token: iframeToken,
                                  });
                                }
                              }
                            );
                          });
                        }
                      }
                    );
                  });
                }
              }
            );
          });
        }
        check += 1;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//if the payment is true
exports.postOrderDetails = (req, res, next) => {
  // var personalInformationArray = localStorage.getItem("personalInformation");
  // const personalInformationArrayParsed = JSON.parse(personalInformationArray);
  var personalInformationArray =req.cookies.personalInformation;
  personalInformationArrayParsed =JSON.parse(personalInformationArray); //==>

  // cartArray = localStorage.getItem("cart");
  // const parsedArr = JSON.parse(cartArray);
  const cartArray =req.cookies.cart;
  parsedArr =JSON.parse(cartArray); //==>
  

  var price = 0;
  var check = 1;

  var productsArray = [];
  var artsQuantity = 0;

  for (let i = 0; i < parsedArr.length; i++) {
    artsQuantity += parsedArr[i][2];
    Product.findById(parsedArr[i][0])
      .then((p) => {
        productsArray.push({
          productId: parsedArr[i][0],
          priceType: parsedArr[i][1],
          quantity: parsedArr[i][2],
        });
        if (parsedArr[i][1] == "A0Price") {
          price += parsedArr[i][2] * p.A0price;
        } else if (parsedArr[i][1] == "A1Price") {
          price += parsedArr[i][2] * p.A1price;
        } else if (parsedArr[i][1] == "A2Price") {
          price += parsedArr[i][2] * p.A2price;
        } else if (parsedArr[i][1] == "A3Price") {
          price += parsedArr[i][2] * p.A3price;
        }
        return price;
      })
      .then((price) => {
        // handle if payment success = true (callback)
        // if payment true ----------->

        console.log("req"); // is the request from callBack function
        console.log(req.query);
        console.log("req success");
        console.log(req.query.success);
        if (req.query.success == "true") {
          if (check == parsedArr.length) {
            const order = new Order({
              date: new Date().toISOString(),
           
              firstName: personalInformationArrayParsed[0],
              lastName: personalInformationArrayParsed[1],
              email: personalInformationArrayParsed[2],
              phoneNumber: personalInformationArrayParsed[3],
              city: personalInformationArrayParsed[4],
              street: personalInformationArrayParsed[5],
              BuildingNumber: personalInformationArrayParsed[6],
              floorNumber: personalInformationArrayParsed[7],
              apartmentNumber: personalInformationArrayParsed[8],
              address: personalInformationArrayParsed[9],
              totalPrice: price + 150,
              totalArts: artsQuantity,
              products: productsArray,
              shipped: false,
              onTheWay: false,
              delivered: false,
            });

            order
              .save()
              .then((orderId) => {
                // const jsonpersonalInformationArr = JSON.stringify([]);
                // localStorage.setItem(
                //   "personalInformation",
                //   jsonpersonalInformationArr
                // );

                const jsonpersonalInformationArr = JSON.stringify([]);
                res.cookie('personalInformation', jsonpersonalInformationArr);

                // const jsonCartArr = JSON.stringify([]);
                // localStorage.setItem("cart", jsonCartArr);
                const jsonCartArr = JSON.stringify([]);
                res.cookie('cart',jsonCartArr);

                console.log(orderId._id);
                res.redirect("../orderDetails/" + orderId._id);
              })
              .catch((err) => {
                console.log(err);
              });
          }
          check += 1;
        } else {
        var firstName = personalInformationArrayParsed[0];
        var lastName = personalInformationArrayParsed[1];
        var email = personalInformationArrayParsed[2];
        var phoneNumber = personalInformationArrayParsed[3];
        var city = personalInformationArrayParsed[4];
        var street = personalInformationArrayParsed[5];
        var BuildingNumber = personalInformationArrayParsed[6];
        var floorNumber = personalInformationArrayParsed[7];
        var apartmentNumber = personalInformationArrayParsed[8];
        var address = personalInformationArrayParsed[9];

        res.render("../views/pages/paymentError.ejs" ,{
            firstName:firstName,
            lastName:lastName,
            email:email,
            phoneNumber:phoneNumber,
            city:city,
            street:street,
            BuildingNumber:BuildingNumber,
            floorNumber:floorNumber,
            apartmentNumber:apartmentNumber,
            address:address,
          });

        }

        // handle if payment success = false (callback)
        // if payment false ----------->
        // redirect to Error page
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
exports.paymentError = (req, res, next) => {
  // var personalInformationArray = localStorage.getItem("personalInformation");
  // const personalInformationArrayParsed = JSON.parse(personalInformationArray);

  var personalInformationArray = req.cookies.personalInformation;
  const personalInformationArrayParsed = JSON.parse(personalInformationArray);

  var firstName = personalInformationArrayParsed[0];
  var lastName = personalInformationArrayParsed[1];
  var email = personalInformationArrayParsed[2];
  var phoneNumber = personalInformationArrayParsed[3];
  var city = personalInformationArrayParsed[4];
  var street = personalInformationArrayParsed[5];
  var BuildingNumber = personalInformationArrayParsed[6];
  var floorNumber = personalInformationArrayParsed[7];
  var apartmentNumber = personalInformationArrayParsed[8];
  var address = personalInformationArrayParsed[9];

  res.render("../views/pages/paymentError.ejs" ,{
    firstName:firstName,
    lastName:lastName,
    email:email,
    phoneNumber:phoneNumber,
    city:city,
    street:street,
    BuildingNumber:BuildingNumber,
    floorNumber:floorNumber,
    apartmentNumber:apartmentNumber,
    address:address,
  });
              
};
exports.orderDetails = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      var productArray = [];
      var prods = order.products;
      var prodsLength = order.products.length;
      var check = 1;
      console.log(prods);
      for (let i = 0; i < prods.length; i++) {
        Product.findById(prods[i]["productId"])
          .then((p) => {
            console.log(p);
            if (p != null) {
              p.priceType = prods[i]["priceType"];
              p.quantity = prods[i]["quantity"];
            }
            return p;
          })
          .then((product) => {
            productArray.push(product);
          })
          .then((value2) => {
            if (check == prodsLength) {
              res.render("../views/pages/orderDetails.ejs", {
                date: order.date,
                orderId: order._id,
                firstName: order.firstName,
                lastName: order.lastName,
                email: order.email,
                city: order.city,
                street: order.street,
                BuildingNumber: order.BuildingNumber,
                floorNumber: order.floorNumber,
                apartmentNumber: order.apartmentNumber,
                phoneNumber: order.phoneNumber,
                address: order.address,
                totalPrice: order.totalPrice,
                delivered: order.delivered,
                onTheWay: order.onTheWay,
                shipped: order.shipped,
                products: productArray,
              });
            }
            check += 1;
          })
          .catch((err) => {
            res.render("../views/pages/500.ejs");
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
//cart page
exports.checkoutArts = (req, res, next) => {
  var cartArray = []; // fetch array in the cart localStorage
  var productArray = []; // all products
  try {
    // res.render('../views/pages/checkoutArts.ejs',{
    //     products:productArray
    //   });
    // cartArray = localStorage.getItem("cart");
    // if product is deleted so nit found should handle
    // const parsedArr = JSON.parse(cartArray); // if there is products in cartArray

    cartArray = req.cookies.cart;
    const parsedArr =JSON.parse(cartArray); //==>

    
    if (
      parsedArr.length == 0 ||
      parsedArr == undefined ||
      parsedArr == null ||
      parsedArr == []
    ) {
      console.log("here1");
      res.render("../views/pages/checkoutArts.ejs", {
        products: productArray,
      });
    }
    var prodsLength = parsedArr.length;
    var check = 1;
    for (let i = 0; i < parsedArr.length; i++) {
      // handle if delete product -----------------------------------------> important
      // parsedArr[i][0] is the id of the product
      Product.findById(parsedArr[i][0])
        .then((p) => {
          p.description = parsedArr[i][1];
          p.quantity = parsedArr[i][2];
          return p;
        })
        .then((product) => {
          productArray.push(product);
        })
        .then((value2) => {
          if (check == prodsLength) {
            res.render("../views/pages/checkoutArts.ejs", {
              products: productArray,
            });
          }
          check += 1;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (e) {
    res.render("../views/pages/checkoutArts.ejs", {
      products: productArray,
    });
  }

  // res.render('../views/pages/checkoutArts.ejs',{
  //   products:product
  // });
};
exports.postCheckoutArts = (req, res, next) => {
  res.render("../views/pages/personalInformation.ejs");
};

exports.postAddCart = (req, res, next) => {
  const id = req.body.id;
  const artDimensions = req.body.artDimensions;
  const quantity = req.body.quantity;
  const newArt = [id, artDimensions, quantity];
  var cartArray = [];
  try {
    // cartArray = localStorage.getItem("cart");

    cartArray = req.cookies.cart;
    cartArray =JSON.parse(cartArray); //==>
  } catch (e) {
    cartArray = [];
  }

  if (cartArray == null) {
    //store
    cartArray = [newArt];

    // const jsonCartArr = JSON.stringify(cartArray); // store not normal array
    // localStorage.setItem("cart", jsonCartArr);
     const jsonCartArr = JSON.stringify(cartArray); // store not normal array
    res.cookie('cart', jsonCartArr);

    //restore
    // var cartArray = localStorage.getItem("cart");
    // const parsedArr = JSON.parse(cartArray); //normal array

    var cartArray = req.cookies.cart;
    parsedArr =JSON.parse(cartArray); //==>
    console.log(parsedArr);
  } else {
    // var cartArray = localStorage.getItem("cart");
    // var parsedArr = JSON.parse(cartArray);

    var cartArray = req.cookies.cart;
    if (cartArray == undefined){
      
    //store
    cartArray = [newArt];

    // const jsonCartArr = JSON.stringify(cartArray); // store not normal array
    // localStorage.setItem("cart", jsonCartArr);
     const jsonCartArr = JSON.stringify(cartArray); // store not normal array
    res.cookie('cart', jsonCartArr);

    //restore
    // var cartArray = localStorage.getItem("cart");
    // const parsedArr = JSON.parse(cartArray); //normal array

    var cartArray = req.cookies.cart;
    console.log(typeof cartArray);
    console.log(cartArray);
    parsedArr =JSON.parse(cartArray); //==>
    console.log(parsedArr);

    }else{
    parsedArr =JSON.parse(cartArray); //==>
    }
    var found = false;
    for (let i = 0; i < parsedArr.length; i++) {
      if (parsedArr[i][0] == id && parsedArr[i][1] == artDimensions) {
        var oldQuantity = parseInt(parsedArr[i][2]);
        var addedQuantity = parseInt(quantity);
        var newQuantity = oldQuantity + addedQuantity;

        parsedArr[i][2] = newQuantity.toString();
        found = true;

        // const jsonCartArr = JSON.stringify(parsedArr);
        // localStorage.setItem("cart", jsonCartArr);
        const jsonCartArr = JSON.stringify(parsedArr);
        res.cookie('cart', jsonCartArr)
      }
    }
    if (!found) {
      parsedArr.push(newArt);
      // const newCartArray = JSON.stringify(parsedArr);
      // localStorage.setItem("cart", newCartArray);

      const newCartArray = JSON.stringify(parsedArr);
      res.cookie('cart', newCartArray)
    }

    // //restore
    // var cartArray = localStorage.getItem("cart");
    // parsedArr = JSON.parse(cartArray);
    // console.log(parsedArr);
    res.redirect("../../cart");
  }
};
exports.postRemoveFromCart = (req, res, next) => {
  const id = req.body.id;
  const size = req.body.size;
  let resultSize = size.replace(/^\s+|\s+$/gm, "");

  // cartArray = localStorage.getItem("cart");
  // const parsedArr = JSON.parse(cartArray);

  cartArray = req.cookies.cart;
  const parsedArr =JSON.parse(cartArray); //==>

  console.log("yessssss-1");
  // only one item
  if (parsedArr.length == 1) {
    console.log("yessssss0");
    var cartArray = [];
    // const newCartArray = JSON.stringify(cartArray);
    // localStorage.setItem("cart", newCartArray);
    const newCartArray = JSON.stringify(cartArray);
    res.cookie('cart', newCartArray);

    res.redirect("../../cart");
  } else {
    for (let i = 0; i < parsedArr.length; i++) {
      console.log("yessssss1");
      if (parsedArr[i][0] == id && parsedArr[i][1] == resultSize) {
        console.log("yessssss2");
        parsedArr.splice(i, 1);
        // const newCartArray = JSON.stringify(parsedArr);
        //console.log(newCartArray);
        // localStorage.setItem("cart", newCartArray);
        
        const newCartArray = JSON.stringify(parsedArr);
        res.cookie('cart', newCartArray); 

        res.redirect("../../cart");
      }
    }
  }
};

exports.postCheckOrderId = (req, res, next) => {
  var orderId = req.body.orderId;
  console.log(orderId);
  var mongoose = require("mongoose");

  Order.findById(orderId)
    .then((order) => {
      console.log(order);
      if (order != null) {
        res.redirect("../../orderDetails/" + orderId);
      } else {
        res.render("../views/pages/orderIdNotFound.ejs");
      }
    })
    .catch((err) => {
      res.render("../views/pages/orderIdNotFound.ejs");
      console.log(err);
    });
};

exports.postpaymentCallBack = (req, res, next) => {
  ////////////////////////change

  var success = req.body.success;
  console.log("paymentCallBack");
  console.log(success);
};
