const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

// init admin
admin.initializeApp();
const app = express();

app.get("/screams", (req, res) => {
    admin
        .firestore()
        .collection("screams")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                });
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err));
});

app.post("/screams", (req, res) => {
    admin
        .firestore()
        .collection("screams")
        .add({
            body: req.body.body,
            userHandler: req.body.userHandler,
            createdAt: new Date().toISOString(),
        })
        .then((doc) => {
            res.json({
                message: `document ${doc.id} created successfully`,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: "something went wrong",
            });
            console.error(err);
        });
});

// https://baseurl.com/api/screams/
exports.api = functions.https.onRequest(app);
// exports.api = functions.region('europe-west1').https.onRequest(app);