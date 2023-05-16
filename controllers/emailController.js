const RejisterData = require("../models/userModel");
const Mail = require("nodemailer/lib/mailer");
const nodemailer = require("nodemailer");






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


  const recieveMail = async (req , res) => {
  
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
        to: email,
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




  module.exports = {
    contactMail,
    sendVerifyMail
  }