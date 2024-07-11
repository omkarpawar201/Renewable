const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Customersdatabase");

// Create a separate connection for the Productdatabase
const productDBConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/Productdatabase");
const productvDBConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/Productvdatabase");

// Create a separate connection for the Cart database
const cartDBConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/Cartdatabase");

// Create a separate connection for the Cart database
const placed_orderDBConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/Placed_orderdatabase");

// Create a separate connection for the Cart database
const completed_orderDBConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/Completed_orderdatabase");

// Create a separate connection for the Cart database
const catogeryDBConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/Catogerydatabase");

// Listen for connection events on Customersdatabase
mongoose.connection.on("connected", () => {
  console.log('Customersdatabase connection successful');
});

mongoose.connection.on("error", (err) => {
  console.log('Customersdatabase connection error:', err.message);
});

// Listen for connection events on Productdatabase
productDBConnection.on("connected", () => {
  console.log('Productdatabase connection successful');
});

productDBConnection.on("error", (err) => {
  console.log('Productdatabase connection error:', err.message);
});

// Listen for connection events on Productdatabase
productvDBConnection.on("connected", () => {
  console.log('Productvdatabase connection successful');
});

productvDBConnection.on("error", (err) => {
  console.log('Productvdatabase connection error:', err.message);
});

// Listen for connection events on Cartdatabase
cartDBConnection.on("connected", () => {
  console.log('Cartdatabase connection successful');
});

cartDBConnection.on("error", (err) => {
  console.log('Cartdatabase connection error:', err.message);
});

placed_orderDBConnection.on("connected", () => {
  console.log('Placed_orderdatabase connection successful');
});

placed_orderDBConnection.on("error", (err) => {
  console.log('Placed_orderdatabase connection error:', err.message);
});

completed_orderDBConnection.on("connected", () => {
  console.log('Completed_orderdatabase connection successful');
});

completed_orderDBConnection.on("error", (err) => {
  console.log('Completed_orderdatabase connection error:', err.message);
});

catogeryDBConnection.on("connected", () => {
  console.log('Catogerydatabase connection successful');
});

catogeryDBConnection.on("error", (err) => {
  console.log('Catogerydatabase connection error:', err.message);
});