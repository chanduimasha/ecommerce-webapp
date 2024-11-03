const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id: Number,
  // name: String,
  // price: String,
  category: String,
  image: String,
});

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
