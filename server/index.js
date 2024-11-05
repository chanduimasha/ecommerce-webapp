// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const dotenv = require("dotenv");
// const UserModel = require("./model/User");

// dotenv.config();
// const app = express();
// app.use(express.json());

// app.use(cors());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Failed to connect to MongoDB", err));

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

// app.post("/signup", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email + " " + password);
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new UserModel({ email, password: hashedPassword });
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await UserModel.findOne({ email });
//     if (user) {
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch) {
//         res.json("Success");
//       } else {
//         res.status(401).json("Password doesn't match");
//       }
//     } else {
//       res.status(404).json("No Records found");
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const UserModel = require("./model/User");
const ProductModel = require("./model/Products");
const CategoryModel = require("./model/Category");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Product Schema
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   image: { type: String, required: true },
// });

// const Product = mongoose.model("Product", productSchema);

// const categorySchema = new mongoose.Schema({
//   category: { type: String, required: true },
//   image: { type: String, required: true },
// });

// const Category = mongoose.model("Category", categorySchema);

// Routes for products
app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.get('/api/products/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

app.post("/api/products", async (req, res) => {
  const product = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    image: req.body.image,
    // description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assuming you have a Category model defined

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Replace with your actual fetching logic
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post('/api/products/category/:category', async (req, res) => {
//   const category = new Category({
//     name: req.body.name,
//     price: req.body.price,
//     category: req.body.category,
//     image: req.body.image,
//     description: req.body.description
//   });

//   try {
//     const newProduct = await category.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.post('/api/categories', async (req, res) => {
//   const category = new Category({
//     name: req.body.name,
//     price: req.body.price,
//     category: req.body.category,
//     image: req.body.image,
//     description: req.body.description
//   });

//   try {
//     const newCategory = await category.save();
//     res.status(201).json(newCategory);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

app.post("/api/categories", async (req, res) => {

  const category = new CategoryModel({
    category: req.body.category,
    // description: req.body.description,
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
