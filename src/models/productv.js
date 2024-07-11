const mongoose = require("mongoose");

const productvSchema = new mongoose.Schema({
    productbrand: {
        type: String,
        required: true
    },
    productmodel: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,  // This should be a Number type
        required: true
    },
    productimage: {
        type: String
    }
});

const Productv = mongoose.model("Productv", productvSchema);

module.exports = Productv;
