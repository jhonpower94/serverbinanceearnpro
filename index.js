const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const app = express();
const port = process.env.PORT || 9000;

var cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var serviceAccount = require("./config/serviceaccount.json");
const init = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(init);
const auth = getAuth(init);

const server = require("http").createServer(app);
server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

app.post("/plans", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { blockindex, deposit_amount, userid, depositid, duration, rate } =
    req.body;

  db.collection("investments")
    .add({
      blockindex: blockindex,
      deposit_amount: deposit_amount,
      userid: userid,
      depositid: depositid,
      duration: duration,
      rate: rate,
      Checkduration: 1,
    })
    .then(() => {
      res.send(req.body);
    });
});

app.get("/ipn", (req, res) => {
  db.collection("investments")
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
            .collection("deposits")
            .doc(doc.data().depositid)
            .update({
              complete: true,
              return_amount: rt_amount,
            })
            .then(() => {
              db.doc(`users/${doc.data().userid}`)
                .collection("notification")
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
    })
    .then(() => {
      res.send({
        status: "ok",
      });
    })
    .catch((err) => console.log(err));
});

app.post("/delete", (req, res) => {
  const { uid } = req.body;

  auth.deleteUser(uid).catch(function (error) {
    console.log("Error deleting user", uid, error);
  });
  res.send({
    uid: uid,
  });
});
