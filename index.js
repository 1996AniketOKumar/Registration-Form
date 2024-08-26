const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { register } = require("module");

const app = express();
dotenv.config();

const port = process.env.port || 3000;


mongoose.connect('mongodb://localhost:/Registration')

const registrationSchema = new mongoose.Schema({
    name: String,
    phone: String,
    dob: String,
    email: String,
    password: String,
    address: String,
    course: String,

});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) => {
    try {
        const { name, phone, dob, email, password, address, course } = req.body;

        const existingUser = await Registration.findOne({email:email});
        if (!existingUser) {



            const registrationData = new Registration({
                name,
                phone,
                dob,
                email,
                password,
                address,
                course,
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            console.log("User already exist");
            res.redirect("/error");
        }
    }

    catch (error) {
        console.log(error);
        res.redirect("error");

    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
})

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})