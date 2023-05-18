const bodyParser = require("body-parser");
const express = require("express");
const product_route = express();
const session = require("express-session");
const ejs = require("ejs");
const middleware = require("../middleware/uploadMiddleware");


// for middleware
const auth = require("../middleware/auth");
// for session
//  product_route.use(session({
//     secret: process.env.Secret,
//     resave: true,
//     saveUninitialized: true
//   }));


// controllers
// const userController = require("../controllers/userControllers");
const  ProductController = require("../controllers/productControllers");

// multer
const multer = require("multer");
const path = require("path");

// storage for multer
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/mainImage"));
  },

  filename: function (req, file, cb) {
    const name = req.body.bookName + "-book-" + file.originalname;
    console.log("book image name is ", name);
    cb(null, name);
  },
});

//for upload by multer
const upload = multer({ storage: storages }, () => {
  console.log("named successfully");
});


product_route.use(session({
    secret: process.env.Secret,
    resave: true,
    saveUninitialized: true
  }));


  //ejs
 product_route.set("view engine", "ejs");
 product_route.set("views", "./views/users");


 product_route.get("/appendbook",auth.islogin,ProductController.appendProduct);
//  product_route.get("/appendbook",auth.islogout,userController.login);

//for post route
// ,auth.islogin
 product_route.post("/appendbook" ,auth.islogin,upload.single("mainImage"), ProductController.insertProduct);

 
 module.exports = product_route;