const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const extract = require("extract-inline-css");

const app = express();
const port = process.env.PORT || 9000;

var cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var serviceAccount = require("./config/serviceaccount.json");
const init = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(init);
const auth = getAuth(init);

const server = require("http").createServer(app);

// const socketIo = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

app.post("/plans", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const {
    blockindex,
    deposit_amount,
    userid,
    depositid,
    duration,
    rate,
    created_at,
    user,
    block_name,
  } = req.body;

  db.collection("investments")
    .add({
      blockindex: blockindex,
      deposit_amount: deposit_amount,
      userid: userid,
      depositid: depositid,
      duration: duration,
      rate: rate,
      Checkduration: 1,
      created_at: created_at,
      user: user,
      blockname: block_name,
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

app.use("/sendmail", require("./sendmilnew"));

app.use("/sendmailmega", require("./sendmailmega"));

app.get("/", (req, res) => {
  extract("./index.html", {
    dist: "./dist",
  });
  res.send({ response: "I am alive" }).status(200);
});

app.get("/striptag", (req, res) => {
 
 
  res.send({ response: "I am alive" }).status(200);
});

let interval;
let intervalWithdrawal;

var Fakerator = require("fakerator");

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(
    () => getApiAndEmit(socket),
    Math.floor(Math.random() * 2000) + 1000
  );

  intervalWithdrawal = setInterval(
    () => getApiAndEmitWithdrawal(socket),
    Math.floor(Math.random() * 2000) + 1000
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  var fakerator = Fakerator();
  const currencies = ["BTC", "USDT", "ETH", "BNB"];
  const amount = Math.floor(Math.random() * 30000) + 50;

  var depositData = {
    name: fakerator.names.name(),
    amount: amount,
    currency: currencies[Math.floor(Math.random() * currencies.length)],
  };
  // Emitting a new message. Will be consumed by the client
  socket.emit("DepositData", depositData);
};

const getApiAndEmitWithdrawal = (socket) => {
  var fakerator = Fakerator();
  const currencies = ["BTC", "USDT", "ETH", "BNB"];
  const amount = Math.floor(Math.random() * 30000) + 50;

  var withdrawalData = {
    name: fakerator.names.name(),
    amount: amount,
    currency: currencies[Math.floor(Math.random() * currencies.length)],
  };

  // Emitting a new message. Will be consumed by the client
  socket.emit("WithdrawalData", withdrawalData);
};
