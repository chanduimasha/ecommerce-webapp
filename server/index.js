const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const UserModel = require("./model/User");
const ProductModel = require("./model/Products");
const CategoryModel = require("./model/Category");
const CartModel = require("./model/Cart");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const router = express.Router();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Order Schema
const orderSchema = new mongoose.Schema({
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  shippingDetails: {
    fullName: String,
    email: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentDetails: {
    cardNumber: String,
    cardHolder: String,
    expiryDate: String,
    // Note: In a production environment, you should never store complete card details
    // Instead, use a payment processor like Stripe
  },
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const Order = mongoose.model('Order', orderSchema);

app.delete('/api/cart/clear', async (req, res) => {
  try {
    await CartModel.deleteMany({});
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    // In a production environment, you would:
    // 1. Validate the payment with a payment processor
    // 2. Only store the payment reference, not the actual card details
    // 3. Handle inventory updates
    // 4. Send confirmation emails
    
    const order = new Order({
      items: req.body.items,
      shippingDetails: req.body.shippingDetails,
      paymentDetails: {
        cardHolder: req.body.paymentDetails.cardHolder,
        // Store last 4 digits only
        cardNumber: `****-****-****-${req.body.paymentDetails.cardNumber.slice(-4)}`,
        expiryDate: req.body.paymentDetails.expiryDate
      },
      totalAmount: req.body.totalAmount
    });

    const savedOrder = await order.save();

    // Here you would typically:
    // 1. Send confirmation email
    // 2. Update inventory
    // 3. Notify shipping service
    
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: savedOrder._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.get("/api/products/:id", async (req, res) => {
//   try {
//     const product = await ProductModel.findById(req.params.id);
//     if (product) {
//       res.json(product);
//       console.log(product);
//     } else {
//       res.status(404).json({ message: "Product not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

app.get("/api/cart", async (req, res) => {
  try {
    const cartItems = await CartModel.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.post("/api/cart", async (req, res) => {
//   const { productId, name, price, image, quantity } = req.body;

//   try {
//     let cartItem = await CartModel.findOne({ productId });
//     if (cartItem) {
//       cartItem.quantity += quantity;
//       await cartItem.save();
//     } else {
//       cartItem = new CartModel({
//         name: req.body.name,
//         price: req.body.price,
//         image: req.body.image,
//         quantity: req.body.quantity,
//       });
//       await cartItem.save();
//     }
//     res.status(201).json(cartItem);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Backend cart routes (in server.js)
app.post("/api/cart", async (req, res) => {
  const { productId, name, price, image, quantity } = req.body;

  try {
    // Check if item already exists in cart
    let cartItem = await CartModel.findOne({ productId: productId });
    
    if (cartItem) {
      // If item exists, update quantity
      cartItem.quantity = Number(cartItem.quantity) + Number(quantity);
      await cartItem.save();
    } else {
      // If item doesn't exist, create new cart item
      cartItem = new CartModel({
        productId,
        name,
        price: Number(price),
        image,
        quantity: Number(quantity)
      });
      await cartItem.save();
    }
    
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update the PUT endpoint to use productId
app.put("/api/cart/:productId", async (req, res) => {
  const { quantity } = req.body;
  
  try {
    const cartItem = await CartModel.findOne({ productId: req.params.productId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    cartItem.quantity = Number(quantity);
    await cartItem.save();
    
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  try {
    const cartItem = await CartModel.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// Routes for products
app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  const product = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    image: req.body.image,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Replace with your actual fetching logic
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/categories", async (req, res) => {
  const category = new CategoryModel({
    category: req.body.category,
    image: req.body.image,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ message: "Failed to create category" });
  }
});

// User signup
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.json("Success");
      } else {
        res.status(401).json("Password doesn't match");
      }
    } else {
      res.status(404).json("No Records found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
