const {Cashfree} = require("cashfree-pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

Cashfree.XClientId = "client_id";
Cashfree.XClientSecret =
  "client_secret";
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

app.post('/order', (req, res) => {
    const request = req.body;

    try {
        Cashfree.PGCreateOrder("2023-08-01", request)
        .then((response) => {
            console.log("Order Created", response.data);
            res.send(response.data)
        }).catch((error) => {
            console.log("Error: ", error.response.data.message)
        })
    } catch (error) {
        console.error("Error at server side:", error)
    }
})

app.post('/checkStatus', (req, res) => {
    var request = req.body.order_id;
    try {
        Cashfree.PGOrderFetchPayments("2023-08-01", request)
        .then((response) => {
            console.log("Order status fetched");
            res.send(response.data)
        })
        .catch((error) => {
            console.log("Error occured")
        })
    } catch(error) {
        console.log("some error occured");
    }
})

app.listen(3001, () => {
    console.log("server is running on port 3001");
})
