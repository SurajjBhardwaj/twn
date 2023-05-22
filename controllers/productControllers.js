const product = require("../models/productModel");
const users = require("../models/userModel");
const nodemailer = require("nodemailer")
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

const appendProduct = async (req,res)=>{
    
    // for adding new data
    res.status(200);
    const id = req.session.user_id;
    const user = await users.findOne({_id:id});
    console.log(user);
    res.render("product",{name:user.name});

}


const insertProduct = async (req,res)=>{
        
     try {
        
        const productdata = new product({
          bookName: req.body.bookName,
          tittle:req.body.tit,
          about:req.body.about,
          authorName:req.body.authorName,
          vender_id:req.session.user_id,
          rentPrice:req.body.rentPrice,
          location:req.body.location,          
          image: req.file.filename,
        //   coverImages: req.file.filename,
        });
        
        console.log("product data",productdata);

        const data = await productdata.save();
        if(data){
            console.log("book data added");
        
            // for a mail
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: "	surajjbhardwaj@gmail.com",
                  pass: "wznijjgptiqmpdak",
                },
              });
               
              const vender =await users.findOne({_id:req.session.user_id});
              console.log("email of vender is ",vender.email);

              const mailOption = {
                from: "surajjbhardwaj@gmail.com",
                to: vender.email,
                subject: "for book submission",
                html:
                  " <p1> hii " +
                  vender.name +
                  ' thank you for adding your book,we willl verify and inform you soon </p1>',
              };
          
              transporter.sendMail(mailOption, function (error, info) {
                if (error) console.log(error);
                else {
                  console.log("email has been send ", info.response);
                }
              });

            return res.redirect('/home');
        }else{
            console.log("failed during saving data");
            res.status(404);
            res.redirect("/appendbook");
        }
        
     } catch (error) {
        console.log("error at insertProduct ",error);
     }

}

 
module.exports ={
    insertProduct,
    appendProduct,
    upload
}
