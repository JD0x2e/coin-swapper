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

  await Favourite.create({
    name: "Ethereum",
    price: "$10,000",
    symbol: "ETH",
  });

  console.log("Favourite coin added!");
}

seed();
