const mongoose = require("mongoose");
const { Schema } = mongoose;

const favouriteSchema = new Schema({
  wallet: String,
  symbol: String,
});

const Favourite = mongoose.model("Favourite", favouriteSchema);

module.exports = Favourite;
