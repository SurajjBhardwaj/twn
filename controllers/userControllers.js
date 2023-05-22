const RejisterData = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");
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


// for strong password

const strongPassword = async (password) => {
  try {
    const securep = await bcrypt.hash(password, 10);
    console.log(securep);
    return securep;
  } catch (error) {
    // sendding status of error
    res.status(404).send();
    console.log(error);
  }
};

// for send mail
const sendVerifyMail = async (name, email, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "surajjbhardwaj@gmail.com",
        pass: process.env.pass,
      },
    });
    console.log(process.env.pass);
    const mailOption = {
      from: "surajjbhardwaj@gmail.com",
      to: email,
      subject: "for verification mail",
      html:
        " <p1> hii " +
        name +
        ' click here to <a href="https://townofbook.onrender.com/verify?id=' +
        id +
        ' " >  verify </a> your mail</p1>',
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) console.log(error);
      else {
        console.log("email has been send ", info.response);
      }
    });
  } catch (error) {
    res.status(404).send();
  }
};



const contactMail = async (req , res) => {

  const name =req.body.namee;
  const email=  req.body.email;
  const Subject = req.body.subject;
  const messege = req.body.messege;

  console.log('name is '+ name + "from "+email+" regarding "+ Subject+" "+messege);
  const admins = ["pandeyyysuraj@gmail.com" , "jyotikumari4442@gmail.com"]


   try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "surajjbhardwaj@gmail.com",
        pass: process.env.pass,
      },
    });
    console.log(process.env.pass);
    

    const mailOption = {
      from: "surajjbhardwaj@gmail.com",
      to: "pandeyyysuraj@gmail.com , jyotikumari4442@gmail.com",
      subject: "Contact support for "+ Subject,
      html:`
          <h2>Dear admin</h2><p> You're recieving this email to solve an issue of <b> ${name} </b> and ${email} ,<br/> He is facing issue regarding ${Subject} </p>
          <b>Discription of issues : </b> <br>
          <p>  ${messege} </p>
          <p>regards</p>
          <a href="https://townofbook.onrender.com" ><p>TOWN OF BOOK</p></a>
      `
       ,
    };
  

    transporter.sendMail(mailOption, function (error, info) {
      if (error) console.log(error);
      else {
        console.log("email recieved ", info.response);
       res.send(`<script>
       alert("Thanks for your messege");
       window.location.href = "/";
     </script>`)
      }
    });
   } catch (error) {
    res.status(404).send();
   }
   
};


//smpt password : slflxbxsbmupufzf
// email : securesally@gmail.com;

const loadRejister = async (req, res) => {
  try {
    res.status(200);
    res.render("rejistration",{name:"login/rejister"});
    console.log("rejister route is running");
  } catch (error) {
    console.log(error);
  }
};

const insertUser = async (req, res) => {
  try {
    const spassword = await strongPassword(req.body.password);
    console.log("working");
    const user = new RejisterData({
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      // hasshed password
      password: spassword,
      image: req.file.filename,
      is_admin: 0,
    });

    console.log("user ", user);
    const saveddata = user.save();

    if (saveddata) {
      console.log("daata saved in mongodb");
      // nodemailer works to verify
      sendVerifyMail(req.body.name, req.body.email, (await saveddata)._id);

      // if we wants to send the json
      //   res.send((await saveddata).toJSON());
      res.status(200);
      res.send(`<script>
      alert("Registration successful!");
      window.location.href = "/login";
    </script>`);
      // res.redirect("/login");
    } else {
      console.log("not saving data");
      res.status(400);
      res.send(`<script>
      alert("something gone wrong! try again");
      window.location.href = "/rejister";
    </script>`);
    }
  } catch (error) {
    console.log(error);
    res.send(`<script>
    alert("something gone wrong! try again");
    window.location.href = "/rejister";
  </script>`);
  }
};

const verifyl = async (req, res) => {
  try {
    const updateInfo = await RejisterData.updateOne(
      { _id: req.query.id },
      { $set: { is_varified: 1 } }
    );
    console.log(updateInfo);
    res.status(200);
    res.render("verifiedemail");
    console.log("user verified");
  } catch (error) {
    console.log(error);
  }
};

// for verify login
const verifylogin = async (req, res) => {
  try {
    req.session.redirected = false;
    const email = req.body.email;
    console.log("password is ", email);

    const Pasword = req.body.password;
    console.log("password is ", Pasword);
    const userdata = await RejisterData.findOne({ email: email });
    if (userdata) {
      //comparing bcrypt passwords
      const match = await bcrypt.compare(Pasword, userdata.password);

      //if password is matching
      if (match) {
        // if user is not verified
        // for future
        // if (userdata.is_varified === 0) {
        //     res.status(200);
        //   res.render("login", { messege: "user is not verified" });
        //   console.log("fault user");
        // } else {
        //   req.session.user_id = userdata._id;
        //   res.status(200);
        //   res.redirect("/home");

        // for home  without verification
          req.session.user_id = userdata._id;
          res.status(200);
         return res.redirect("/home");
        
      } else {
        res.status(200);
        console.log("wrong password or email");
        res.redirect("loginerr");
      }
    } else {
        res.status(200);
        console.log("wrong password or email 91");
      res.redirect("loginerr");
    }
  } catch (error) {
    console.log(error);
  }
};

const messages = {
  messege1: 'login/signup',
  message2: 'email or password is incorrect',
  messege3: 'password and confirm passwords are not maching'
};


// for login error
const loginerr = async (req,res)=>{
   try {
    
    res.status(200);
    res.render("login",{messages: messages},);

   } catch (error) {
    res.status(400);
    console.log(error);
    console.log("error at 178 usercontroller");
   }

}


// for login

const login = async (req, res) => {
  try {
    res.status(200);
    res.render("login",{name:"login/rejister"});
  } catch (error) {
    console.log("error " + error);
  }
};

//for load home
const loadhome = async (req, res) => {
    res.status(200);
    const id = req.session.user_id;
    const user = await RejisterData.findOne({_id:id});
    console.log(user);
  res.render("home",{name:user.name});
  console.log("successfully logined");
};

// for logout
const logout = async (req,res)=>{
   
    try {
        
        req.session.destroy();
        res.redirect("/login");

    } catch (error) {
        console.log("error at logout",error);
    }

}

// for contact load
const loadContact = async(req,res)=>{
    try {
      res.status(200);
      const id = req.session.user_id;
      const user = await RejisterData.findOne({_id:id});
      res.render("contact",{name:user.name});
    } catch (error) {
        console.log("error is ",error);
    }
}

//for view load

const loadview = async(req,res)=>{
    try {
      res.status(200);
      const id = req.session.user_id;
      const user = await RejisterData.findOne({_id:id});
      console.log(user);
    res.render("view",{name:user.name});
    } catch (error) {
        console.log("error is ",error);
    }
}

// for book rent load
const loadbookrentt = async(req,res)=>{
    try {
      res.status(200);
      const id = req.session.user_id;
      const user = await RejisterData.findOne({_id:id});
      console.log(user);
    res.render("bookrentt",{name:user.name});
    } catch (error) {
        console.log("error is ",error);
    }
}

// faltu ka peace
const  loadnewbook = async (req,res)=>{

     try {
      res.render("product");
     } catch (error) {
      console.log("error here ",error);
     }


}  






module.exports = {
  loadRejister,
  insertUser,
  verifyl,
  login,
  loginerr,
  verifylogin,
  loadhome,
  logout,
  loadContact,
  contactMail,
  loadview,
  loadnewbook,//faltu ka hai ise product route me already kiya tha
  loadbookrentt,
  upload
};
