const mongoose = require("mongoose");
const Favourite = require("./models/favourite");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

async function seed() {
  await Favourite.create({
    name: "Bitcoin",
    price: "$100,000",
    symbol: "BTC",
  });

  console.log("Favourite coin added!");
}

seed();
