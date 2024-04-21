const express = require("express");
const bodyParser = require("body-parser");
const Product = require('./Product');
const WaitingList = require('./WaitingList');
const HistoryLists = require("./HistoryLists");

const app = express();
const port = 3000;
app.use(bodyParser.json());


// PRODUCT SECTION
app.post("/createProduct", async (req, res) => {
  const response = Product.create(req.body)
  return res.status(response.state ? 200 : 400).json(response);
});
app.get("/getProductsByQuery", async (req, res) => {
  const response = Product.getByQuery(req.query)
  return res.status(response.state ? 200 : 400).json(response);
});

// WAITING LIST SECTION
app.post("/waitingList/pushItem", async (req, res) => {
  const response = WaitingList.pushBack(req.body)
  return res.status(response.state ? 200 : 400).json(response);
});
app.get("/waitingList/get", async (req, res) => {
  const response = WaitingList.get()
  return res.status(response.state ? 200 : 400).json(response);
});
app.get("/waitingList/export", async (req, res) => {
  const response = WaitingList.export()
  return res.status(response.state ? 200 : 400).json(response);
});

// HISTORY LISTS SECTION
app.get("/HistoryLists/getByQuery", async (req, res) => {
  const response = HistoryLists.getByQuery(req.query);
  return res.status(response.state ? 200 : 400).json(response);
});

app.listen(port, () => {
  console.log(`You're in ;)`);
});
