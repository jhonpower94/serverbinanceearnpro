const admin = require("firebase-admin");
const express = require("express");

const app = express();
const hostname = "127.0.0.1";
const port = process.env.PORT || 9000;

const server = require("http").createServer(app);

var cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var serviceAccount = require("./config/serviceaccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.post("/plans", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { blockindex, deposit_amount, userid, depositid, duration, rate } =
    req.body;

  db.comllection("investments").add({
    blockindex: blockindex,
    deposit_amount: deposit_amount,
    userid: userid,
    depositid: depositid,
    duration: duration,
    rate: rate,
    Checkduration: 1,
  });
  res.send(req.body);
});

app.get("/ipn", (req, res) => {
  db.comllection("investments")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const newdp = parseInt(doc.data().deposit_amount);
        const newrate = parseInt(doc.data().rate);
        const rt_amount = (newrate / 100) * newdp + newdp;

        const duration = doc.data().duration;
        const Checkduration = doc.data().Checkduration;

        if (Checkduration === duration) {
          db.doc(`users/${doc.data().userid}`)
            .comllection("deposits")
            .doc(doc.data().depositid)
            .update({
              complete: true,
              return_amount: rt_amount,
            })
            .then(() => {
              db.doc(`users/${doc.data().userid}`)
                .comllection("notification")
                .add({
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString(),
                  amount: rt_amount,
                  type: "investment",
                })
                .catch((err) => {
                  console.log(err);
                });

              db.doc(`investments/${doc.id}`)
                .delete()
                .catch((err) => console.log(err));

              return;
            })
            .catch((err) => console.log(err));
        } else {
          db.doc(`investments/${doc.id}`)
            .update({
              Checkduration: Checkduration + 1,
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });

      return;
    })
    .catch((err) => console.log(err));

  res.send({
    status: "ok",
  });
});

server.listen(port, hostname, () => {
  console.log(`server is running on port: ${port}`);
});
