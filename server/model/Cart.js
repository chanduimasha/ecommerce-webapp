// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     id: Number,
//     name: String,
//     price: String,
//     image: String,
//     quantity: String
// });

// const CartModel = mongoose.model('Cart', cartSchema);

// module.exports = CartModel;

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;