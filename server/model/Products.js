const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: String,
    category:String,
    image: String
})

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;