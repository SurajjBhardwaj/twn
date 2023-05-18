const bodyParser = require("body-parser");
const express = require("express");
const user_route = express();
const session = require("express-session");
const product_route = require("./productRoute");
// const cors = require("cors")


// for middleware
const auth = require("../middleware/auth");

// for cloudinary server
const server = require("../server/config/cloudinaryConfig");

//for session seting
user_route.use(session({
  secret: process.env.Secret,
  resave: true,
  saveUninitialized: true
}));

// user_route.use(session({ secret: process.env.Secret }));

// allow cross-origin requests
// user_route.use(cors());

//ejs
user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

// for body parser
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

// controllers
const userController = require("../controllers/userControllers");
const emailController = require("../controllers/emailController");

//multer
const multer = require("multer");
const path = require("path");

// storage for multer
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImage"));
  },

  filename: function (req, file, cb) {
    const name = req.body.name + "-profile pic-" + file.originalname;
    console.log("name is ", name);
    cb(null, name);
  },
});

//for upload by multer
const upload = multer({ storage: storages }, () => {
  console.log("named successfully");
});

//get request
user_route.get("/rejister",auth.islogout, userController.loadRejister);

//for post route
user_route.post("/rejister", upload.single("image"), userController.insertUser);

// for verify route
user_route.get("/verify", userController.verifyl);
user_route.post("/login", userController.verifylogin);

//for error in login
user_route.get("/loginerr",userController.loginerr);

//for home route
user_route.get("/home",auth.islogin , userController.loadhome);

user_route.get("/bookrentt",auth.islogin, userController.loadbookrentt);
// function (req, res) {
//   res.render("bookrentt");
// });

user_route.get("/view",auth.islogin,userController.loadview);
//  function (req, res) {
//   res.render("view");
// });

user_route.get("/contact",auth.islogin,userController.loadContact);
user_route.post("/contact",auth.islogin,emailController.recieveMail);
// function (req,res) {
//          res.render("contact"); 
// })

// user_route.get("/addbooks",auth.islogin,userController.loadnewbook);



// for logut
user_route.get("/logout",auth.islogin,userController.logout);

// for home
user_route.get("/",auth.islogin, userController.loadhome);

// for login route
// user_route.get("/",auth.islogout, userController.login);
user_route.get("/login" ,auth.islogout, userController.login);

//for html ejs

user_route.get("/y",async(req,res)=>{
  res.render("html");
})

user_route.get("/newnn/n",(req,res)=>{
  res.send("heyy");
})

module.exports = user_route;
