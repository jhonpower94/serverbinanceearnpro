const express = require("express");
const router = express.Router();
var cors = require("cors");
router.use(cors());
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

var nodeoutlook = require("nodejs-nodemailer-outlook");

router.route("/").post((req, res) => {
  const { message, to, subject } = req.body;

  const sitename = "Binanceearnpro";
  const imagelogo =
    "https://firebasestorage.googleapis.com/v0/b/binanceearnpro.appspot.com/o/binance.png?alt=media&token=a1262e41-6937-45dc-8950-fa0ac56c7547";

  // send mail with defined transport object
  nodeoutlook.sendEmail({
    auth: {
      user: "report@mailogeraccess.online",
      pass: "Smtp@2023",
    },
    from: '"Binanceearnpro" <report@mailogeraccess.online>',
    to: to,
    subject: `${subject} / ${sitename}`,
    html: `<html> <head> <meta name="GENERATOR" content="MSHTML 11.00.10570.1001" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> </head> <body> <table width="100%" id="m_7429505259137444005wrappertable" style=" border: currentColor; border-image: none; color: rgb(34, 34, 34); text-transform: none; letter-spacing: normal; font-family: Arial, Helvetica, sans-serif; font-size: small; font-style: normal; font-weight: 400; word-spacing: 0px; white-space: normal; table-layout: fixed; border-spacing: 0px !important; orphans: 2; widows: 2; background-color: rgb(255, 255, 255); font-variant-ligatures: normal; font-variant-caps: normal; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td align="center" valign="top" style=" margin: 0px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; " > <table style=" border: currentColor; border-image: none; border-spacing: 0px !important; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td width="600" align="center" valign="top" style=" margin: 0px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; background-color: rgb(255, 255, 255); " > <table width="100%" style=" padding: 0px 0px 10px; border: currentColor; border-image: none; border-spacing: 0px !important; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td valign="middle" style=" margin: 0px; line-height: 1px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; " ></td> </tr> <tr style="border-spacing: 0px"> <td align="center" valign="top" style=" margin: 0px; padding: 0px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; " > <table style=" border: currentColor; border-image: none; border-spacing: 0px !important; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td width="600" align="center" valign="middle" style=" margin: 0px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; " > <img width="180" align="left" alt="" src=${imagelogo} border="0" hspace="0" /> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" style=" border: currentColor; border-image: none; border-spacing: 0px !important; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td valign="middle" style=" margin: 0px; color: rgb(65, 65, 65); line-height: 24px; letter-spacing: 0px; padding-right: 20px; padding-left: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: normal; min-height: 20px; border-spacing: 0px; " > <br /> ${message} </td> </tr> </tbody> </table> <table width="100%" style=" border: currentColor; border-image: none; border-spacing: 0px !important; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td style=" margin: 0px; line-height: 0px; padding-top: 10px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; " ></td> </tr> </tbody> </table> <table width="100%" style=" border: currentColor; border-image: none; border-spacing: 0px !important; " border="0" cellspacing="0" cellpadding="0" > <tbody> <tr style="border-spacing: 0px"> <td style=" margin: 0px; line-height: 0px; padding-top: 10px; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; border-spacing: 0px; " ></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <div align="center" style=" color: rgb(0, 0, 0); text-transform: none; line-height: 15px; text-indent: 0px; letter-spacing: normal; padding-bottom: 10px; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-style: normal; font-weight: 400; word-spacing: 0px; white-space: normal; orphans: 2; widows: 2; background-color: rgb(255, 255, 255); font-variant-ligatures: normal; font-variant-caps: normal; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; " > Kindly note that all e-mails from ${sitename} are confidential. </div> <p align="left" style=" color: rgb(34, 34, 34); text-transform: none; text-indent: 0px; letter-spacing: normal; font-family: Arial, Helvetica, sans-serif; font-size: small; font-style: normal; font-weight: 400; word-spacing: 0px; white-space: normal; orphans: 2; widows: 2; background-color: rgb(255, 255, 255); font-variant-ligatures: normal; font-variant-caps: normal; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; " > <font color="#888888" ><strong><br /></strong ></font> </p> </body></html>`,
    replyTo: "report@mailogeraccess.online",

    onError: (e) => {
      console.log(e);
    },
    onSuccess: (i) => {
      res.sendStatus(200);
      console.log(i);
    },
  });
});

module.exports = router;
