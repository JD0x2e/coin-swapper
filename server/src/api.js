"use strict";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Favourite = require("./models/favourite");
const bp = require("body-parser");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE_URL);

app.get("/.netlify/functions/api", (req, res) => {
  console.log("we are here");
  res.json({ Jack: "is great" });
});

// retrieve a specific wallet's favourite coins
app.get("/.netlify/functions/api/favourites/:wallet", async (req, res) => {
  try {
    // try and make a call to the database
    const theFavourites = await Favourite.find({ wallet: req.params.wallet });
    res.status(200).json(theFavourites);
  } catch (err) {
    // show the error if the "try" fails
    console.log(err);
    res.status(500).json(err);
  }
});

// create a new favourite coin
app.post("/.netlify/functions/api/favourites", async (req, res) => {
  try {
    const newFavourite = await Favourite.create(req.body);
    res.status(200).json(newFavourite);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete a favourite coin
app.delete("/.netlify/functions/api/favourites/:id", async (req, res) => {
  try {
    const favouriteToDelete = req.params.id;
    const deletedFavourite = await Favourite.deleteOne({ _id: favouriteToDelete }, req.body);
    res.status(200).json(deletedFavourite);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// OLD WAY
// app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

// new Netlify way to start the server
const handler = serverless(app);

// we use this so the handler can use async (that mongoose uses)
module.exports.handler = async (event, context) => {
  // you can do any code here
  const result = await handler(event, context);
  // and here
  return result;
};
// commented
// module.exports.handler = serverless(app);
