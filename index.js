const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the root directory
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/MoneyList', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to the Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/add", (req, res) => {
    const { category_select, amount_input, info, date_input } = req.body;

    const data = {
        "Category": category_select,
        "Amount": amount_input,
        "Info": info,
        "Date": date_input
    };

    db.collection('Users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
        res.redirect('/');
    });
});

app.post("/update", (req, res) => {
    const { id, category_select, amount_input, info, date_input } = req.body;

    const updatedData = {
        "Category": category_select,
        "Amount": amount_input,
        "Info": info,
        "Date": date_input
    };

    db.collection('Users').updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: updatedData },
        (err, result) => {
            if (err) {
                throw err;
            }
            console.log("Record Updated Successfully");
            res.redirect('/');
        }
    );
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    res.redirect('index.html');
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});