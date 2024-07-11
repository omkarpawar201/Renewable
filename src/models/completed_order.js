const mongoose = require("mongoose");

const completed_orderSchema = new mongoose.Schema({
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
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderTime: {
    type: String, // You can use String or another appropriate type for time
    default: new Date().toLocaleTimeString()
  }
});

const Completed_order = mongoose.model("Completed_order", completed_orderSchema);

module.exports = Completed_order;
