const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    registeras: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword:{
        type: String,
        required: true
    }
})

customerSchema.pre("save", async function (next) {
    if(this.isModified("password"))
    {
        console.log(this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password);

        this.confirmpassword = undefined;
    }
    next();
}) 


const Register = mongoose.model("Register", customerSchema);

module.exports = Register;