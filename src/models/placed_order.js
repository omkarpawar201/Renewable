const mongoose = require("mongoose");

const placed_orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderTime: {
    type: String, // You can use String or another appropriate type for time
    default: new Date().toLocaleTimeString()
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

const Placed_order = mongoose.model("Placed_order", placed_orderSchema);

module.exports = Placed_order;
