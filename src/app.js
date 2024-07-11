const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const Register = require("./models/registers");
const Product = require("./models/product");
const Productv = require("./models/productv");
const Cart = require("./models/cart");
const Placed_order = require("./models/placed_order");
const Completed_order = require("./models/completed_order");
const Category = require("./models/category");
const bodyParser = require("body-parser");
require("./db/conn");

const app = express();
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");

app.use(
  session({
    secret: "Discoveryhd@713",
    resave: true,
    saveUninitialized: true,
  })
);

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store uploaded files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../templates/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.use(express.static(templatesPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/main.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/product.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/contact_us.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/login_new.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/Popup/Reg_success.html"));
});

app.get("/product", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/product.html"));
});

app.get("/productv", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/productv.html"));
});

// Add this line after your existing route handlers in app.js
app.get("/delivery", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/views/delivery.html"));
});



app.get("/customerProfile", async (req, res) => {
  try {
    // Assuming you have the user's email stored in the session after login
    const userEmail = req.session.userEmail;

    // Fetch customer information from the database based on the email
    const customer = await Register.findOne({ email: userEmail });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    // Read the content of the customer.html file
    const customerHtmlPath = path.join(
      __dirname,
      "../templates/views/customer.html"
    );
    let customerHtml = fs.readFileSync(customerHtmlPath, "utf8");

    // Inject the customer's name as a data attribute on the body tag
    customerHtml = customerHtml.replace(
      "<body>",
      `<body data-customerName="${customer.firstname}">`
    );

    // Send the modified HTML to the client
    res.send(customerHtml);
  } catch (error) {
    res.status(500).send("Error retrieving customer information: " + error.message);
  }
});

app.get("/vendorProfile", async (req, res) => {
  try {
    // Assuming you have the user's email stored in the session after login
    const userEmail = req.session.userEmail;

    // Fetch customer information from the database based on the email
    const customer = await Register.findOne({ email: userEmail });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    // Read the content of the customer.html file
    const customerHtmlPath = path.join(
      __dirname,
      "../templates/views/vendor.html"
    );
    let customerHtml = fs.readFileSync(customerHtmlPath, "utf8");

    // Inject the customer's name as a data attribute on the body tag
    customerHtml = customerHtml.replace(
      "<body>",
      `<body data-customerName="${customer.firstname}">`
    );

    // Send the modified HTML to the client
    res.send(customerHtml);
  } catch (error) {
    res.status(500).send("Error retrieving customer information: " + error.message);
  }
});

app.get("/myProfile", async (req, res) => {
  try {
    // Assuming you have the user's email stored in the session after login
    const userEmail = req.session.userEmail;

    // Fetch customer information from the database based on the email
    const customer = await Register.findOne({ email: userEmail });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    // Read the content of the profile.html file
    const profileHtmlPath = path.join(
      __dirname,
      "../templates/views/profile.html"
    );
    let profileHtml = fs.readFileSync(profileHtmlPath, "utf8");

    // Replace placeholders with actual customer data
    profileHtml = profileHtml.replace(
      "<%= customer.firstname %>",
      customer.firstname
    );
    profileHtml = profileHtml.replace(
      "<%= customer.lastname %>",
      customer.lastname
    );
    profileHtml = profileHtml.replace("<%= customer.mobile %>", customer.mobile);
    profileHtml = profileHtml.replace("<%= customer.gender %>", customer.gender);
    profileHtml = profileHtml.replace(
      "<%= customer.registeras %>",
      customer.registeras
    );
    profileHtml = profileHtml.replace("<%= customer.email %>", customer.email);

    // Send the modified HTML to the client
    res.send(profileHtml);
  } catch (error) {
    res.status(500).send("Error retrieving customer information: " + error.message);
  }
});

app.post("/register", async (req, res) => {
  try {
    const register = new Register({
      firstname: req.body["firstname"],
      lastname: req.body["lastname"],
      address: req.body["address"],
      mobile: req.body.mobile,
      gender: req.body.gender,
      registeras: req.body["registeras"],
      email: req.body.email,
      password: req.body.password,
      confirmpassword: req.body["Confirm"],
    });

    const registered = await register.save();
    res.redirect("Reg_success.html");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      res.redirect("email_exits.html");
    } else {
      res.status(404).send(error);
    }
  }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email: email });

        if (!user) {
            return res.redirect("user_not_found.html");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session = req.session || {};
            req.session.userEmail = user.email;
            req.session.address = user.address;
            req.session.userRole = user.registeras;

            if (user.registeras === "customer") {
                return res.redirect("/customerProfile");
            } else if (user.registeras === "vendor") {
                return res.redirect("/vendorProfile"); // Adjust the route as needed
            } else if (user.registeras === "admin") {
                return res.sendFile(path.join(__dirname, "../templates/views/admin.html"));
            } else {
                return res.status(403).send("Invalid user type");
            }
        } else {
            console.log("Invalid Password");
            res.redirect("invalid_login.html");
        }
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Add this route handler in app.js
app.get("/admin", async (req, res) => {
  try {
    const totalCustomers = await Register.countDocuments({ registeras: 'customer' });
    const totalVendors = await Register.countDocuments({ registeras: 'vendor' });
    const pendingOrders = await Placed_order.countDocuments({ /* Add criteria for pending orders, if needed */ });
    const completedOrders = await Placed_order.countDocuments({ /* Add criteria for completed orders, if needed */ });

    res.json({
      totalCustomers,
      totalVendors,
      pendingOrders,
      completedOrders
    });
  } catch (error) {
    console.error("Error retrieving admin dashboard data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-category", async (req, res) => {
  try {
      const { newCategory } = req.body;

      // Check if the category already exists
      const existingCategory = await Category.findOne({ name: newCategory });

      if (existingCategory) {
          return res.status(400).send("Category already exists");
      }

      // Create a new category
      const category = new Category({ name: newCategory });
      await category.save();

      // Get the updated list of categories
      const categories = await Category.find().distinct("name");

      // Send the updated categories as a response
      res.json({ categories });
  } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).send("Internal Server Error");
  }
});

// Fetch all categories
app.get("/categories", async (req, res) => {
  try {
      const categories = await Category.find({}, 'name'); // Fetch only the category names
      res.json(categories);
  } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/search", async (req, res) => {
  try {
      const search = req.body.searchbox;

      // Search for products by product brand or category name
      const productsByBrand = await Product.find({ productbrand: search });
      const productsByCategory = await Product.find({ category: search });

      // Combine the results from both searches
      const products = [...productsByBrand, ...productsByCategory];

      if (products.length > 0) {
          // Pass the products array to the product_details view
          return res.render("product_details", { products });
      } else {
          return res.status(404).send("Product not available");
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
  }
});


app.post("/searchv", async (req, res) => {
  try {
      const searchv = req.body.searchbox;

      // Search for products by product brand or category name
      const productsByBrand = await Productv.find({ productbrand: searchv });
      const productsByCategory = await Productv.find({ category: searchv });

      // Combine the results from both searches
      const productvs = [...productsByBrand, ...productsByCategory];

      if (productvs.length > 0) {
          // Pass the products array to the product_details view
          return res.render("product_detailsv", { productvs });
      } else {
          return res.status(404).send("Product not available");
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
  }
});





  
// Fetch categories for rendering product.html
app.get("/product", async (req, res) => {
  try {
      const categories = await Category.find();
      res.render("product", { categories });
  } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send("Internal Server Error");
  }
});

// Fetch categories for rendering productv.html
app.get("/productv", async (req, res) => {
  try {
      const categories = await Category.find();
      res.render("productv", { categories });
  } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send("Internal Server Error");
  }
});


// Create a new product
app.post('/product', upload.single('productimage'), async (req, res) => {
  const { productbrand, productmodel, price, category, weight, description, quantity } = req.body;

  try {
      // Create a new Product document
      const newProduct = new Product({
          productbrand,
          productmodel,
          price,
          category,
          weight,
          description,
          quantity,
          productimage: req.file.buffer, // Assuming you are storing the image in the database
      });

      // Save the product to the database
      await newProduct.save();

      res.redirect("product_add_success.html");
  } catch (error) {
      console.error(error);
      res.redirect("product_add_error.html");
  }
});


app.post('/productv', upload.single('productimage'), async (req, res) => {
  const { productbrand, productmodel, price, category, weight, description, quantity } = req.body;

  try {
      // Create a new Product document
      const newProductv = new Productv({
          productbrand,
          productmodel,
          price,
          category,
          weight,
          description,
          quantity,
          productimage: req.file.buffer, // Assuming you are storing the image in the database
      });

      // Save the productv to the database
      await newProductv.save();

      res.redirect("product_add_success.html");
  } catch (error) {
      console.error(error);
      res.redirect("product_add_error.html");
  }
});



  app.post("/add-to-cart", async (req, res) => {
    try {
      // Assuming you have the user's email stored in the session after login
      const userEmail = req.session.userEmail;
      // Inside the /add-to-cart route
      console.log("User Email:", userEmail);

      let cart = await Cart.findOne({ customerPhoneNumber: userEmail });
  
      // If the cart doesn't exist, create a new one
      if (!cart) {
        cart = new Cart({
          customerPhoneNumber: userEmail,
          products: [],
        });
      }
  
      // Get the product ID from the form submission
      const productId = req.body.productId;
  
      // Check if the product is already in the cart
      const existingProduct = cart.products.find(
        (product) => product.productId === productId
      );
  
      // If the product exists, update its quantity; otherwise, add it to the cart
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          productId,
          quantity: 1,
        });
      }
  
      // Save the cart
      await cart.save();
  
      // Redirect to a success page or send a JSON response
      res.redirect("cart_success.html");
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });
  
// Add this route handler at the end of your app.js file
app.get("/success", (req, res) => {
  res.send("Item successfully added to the cart!"); // You can customize this response
});

app.get("/products-by-category", async (req, res) => {
  try {
      const category = req.query.category;

      if (!category) {
          return res.status(400).send("Category parameter is missing");
      }

      // Fetch products by category from the database
      const products = await Product.find({ category });

      res.json(products);
  } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.get("/products-by-categoryv", async (req, res) => {
  try {
      const category = req.query.category;

      if (!category) {
          return res.status(400).send("Category parameter is missing");
      }

      // Fetch products by category from the database
      const products = await Productv.find({ category });

      res.json(products);
  } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).send("Internal Server Error");
  }
});

// Define a route to handle requests for /product_details
app.get("/product_details", async (req, res) => {
  try {
      // Retrieve the category from the request query parameters
      const category = req.query.category;

      // Fetch products based on the specified category
      const products = await Product.find({ category: category });

      // Render the product_details view with the fetched products
      res.render("product_details", { products });
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.get("/product_detailsv", async (req, res) => {
  try {
      // Retrieve the category from the request query parameters
      const category = req.query.category;

      // Fetch products based on the specified category
      const productvs = await Productv.find({ category: category });

      // Render the product_details view with the fetched products
      res.render("product_detailsv", { productvs });
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.get("/view-cart", async (req, res) => {
  try {
    const userEmail = req.session.userEmail;
    const userRole = req.session.userRole;
    console.log(userRole);

    let cart;
    if (userRole === "customer") {
      cart = await Cart.findOne({ customerPhoneNumber: userEmail });
    } else if (userRole === "vendor") {
      cart = await Cart.findOne({ customerPhoneNumber: userEmail });
    }

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // Fetch product details for each product in the cart from the respective product database
    const productsWithDetails = await Promise.all(
      cart.products.map(async (product) => {
        const productId = product.productId;

        // Fetch product details from the appropriate product database based on userRole
        let productDetails;
        if (userRole === "customer") {
          productDetails = await Product.findById(productId);
        } else if (userRole === "vendor") {
          productDetails = await Productv.findById(productId);
        }

        return {
          productId: productId,
          quantity: product.quantity,
          productDetails: productDetails ? productDetails.toObject() : null,
        };
      })
    );

    const totalPrice = calculateTotalPrice(productsWithDetails);

    res.json({ products: productsWithDetails, totalPrice });
  } catch (error) {
    console.error("Error retrieving cart information:", error);
    res.status(500).send("Internal Server Error");
  }
});



// Add a function to calculate the total price
// Add the /remove-from-cart route handler in your app.js file
app.post("/remove-from-cart/:productId", async (req, res) => {
  try {
    const userEmail = req.session.userEmail;
    const productId = req.params.productId;

    // Find the user's cart
    const cart = await Cart.findOne({ customerPhoneNumber: userEmail });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // Remove the product from the cart based on the productId
    cart.products = cart.products.filter(product => product.productId !== productId);

    // Save the updated cart
    await cart.save();

    // Calculate the total price after removal
    const productsWithDetails = await Promise.all(
      cart.products.map(async (product) => {
        const productId = product.productId;
        const productDetails = await Product.findById(productId);
        return {
          productId: productId,
          quantity: product.quantity,
          productDetails: productDetails.toObject(),
        };
      })
    );
    const totalPrice = calculateTotalPrice(productsWithDetails);

    res.json({ products: productsWithDetails, totalPrice });
  } catch (error) {
    console.error("Error removing item from the cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add this route handler after your existing routes in app.js
// Update the /place-order route handler in app.js
app.post("/place-order", async (req, res) => {
  try {
    const userEmail = req.session.userEmail;
    const address = req.session.address;

    // Fetch the user's cart from the database
    const cart = await Cart.findOne({ customerPhoneNumber: userEmail });

    if (!cart || cart.products.length === 0) {
      return res.status(404).send("Cart is empty");
    }

    // Extract product information from the cart and save it to the Placed_order database
    const placedOrderItems = cart.products.map((product) => ({
      email: userEmail,
      productId: product.productId,
      quantity: product.quantity,
      address: address,
      orderDate: new Date(),
      orderTime: new Date().toLocaleTimeString(),
    }));

    // Save the order items to the Placed_order database
    await Placed_order.insertMany(placedOrderItems);

    // Clear the user's cart after placing the order
    cart.products = [];
    await cart.save();

    res.status(200).send("Order placed successfully");
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("Internal Server Error");
  }
});



// Add a function to calculate the total price
function calculateTotalPrice(products) {
  return products.reduce((total, product) => {
    const productDetails = product.productDetails;
    return total + productDetails.price * product.quantity;
  }, 0);
}

app.get("/delivery-data", async (req, res) => {
  try {
    // Fetch all placed orders from the Placed_order collection
    const placedOrders = await Placed_order.find();

    // Send the placedOrders data as JSON
    res.json(placedOrders);
  } catch (error) {
    console.error("Error fetching placed orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(bodyParser.json());

// Add this route handler after your existing routes in app.js
app.post("/move-to-completed", async (req, res) => {
  try {
    const orderId = req.body.orderId;

    // Find the placed order by ID
    let placedOrder = await Placed_order.findById(orderId);

    if (!placedOrder) {
      return res.status(404).json({ error: "Placed order not found" });
    }

    console.log("Current Status:", placedOrder.status);

    // Check if the status field is undefined and initialize it
    if (placedOrder.status === undefined) {
      placedOrder.status = 'Pending'; // You can set a default status here
      await placedOrder.save();
    }

    // Create a new Completed_order entry with the same data
    const completedOrder = new Completed_order({
      email: placedOrder.email,
      productId: placedOrder.productId,
      quantity: placedOrder.quantity,
      orderDate: placedOrder.orderDate,
      orderTime: placedOrder.orderTime,
      status: 'Completed', // Add the status property here
    });

    // Save the completed order
    await completedOrder.save();

    // Update the status of the placed order
    placedOrder.status = 'Completed';
    await placedOrder.save();

    console.log("Updated Status:", placedOrder.status);

    res.status(200).json({ message: "Order moved to Completed_order successfully" });
  } catch (error) {
    console.error("Error moving order to completed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Add this route handler after your existing routes in app.js
app.post('/confirm-pickup/:orderId', async (req, res) => {
  try {
      const orderId = req.params.orderId;

      // Find the order by ID and update the status
      await Placed_order.findByIdAndUpdate(orderId, { status: 'Picked Up' });

      res.redirect('/my_orders'); // Redirect to the my_orders page
  } catch (error) {
      console.error('Error confirming pickup:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get("/my-orders", async (req, res) => {
  try {
    // Assuming you have the user's email stored in the session after login
    const userEmail = req.session.userEmail;

    // Fetch placed orders from the database based on the user's email
    const placedOrders = await Placed_order.find({ email: userEmail });

    res.render("my_orders", { placedOrders });
  } catch (error) {
    console.error("Error fetching placed orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("server is running");
});
