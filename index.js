const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); 
app.use(bodyParser.urlencoded({ extended: true }));

// Define schema and model
const moneySchema = new mongoose.Schema({
    Category: String,
    Amount: Number,
    Info: String,
    Date: String
});
const Money = mongoose.model('Money', moneySchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MoneyList', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => console.error("Error in connecting to the Database", err));
db.once('open', () => console.log("Connected to Database"));

app.post("/add", async (req, res) => {
    try {
        const { category_select, amount_input, info, date_input } = req.body;

        const newEntry = new Money({
            Category: category_select,
            Amount: amount_input,
            Info: info,
            Date: date_input
        });

        await newEntry.save();
        console.log("Record Inserted Successfully");
        res.redirect('/');
    } catch (err) {
        console.error("Error in inserting record:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/update", async (req, res) => {
    try {
        const { id, category_select, amount_input, info, date_input } = req.body;

        await Money.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: { Category: category_select, Amount: amount_input, Info: info, Date: date_input } }
        );
        console.log("Record Updated Successfully");
        res.redirect('/');
    } catch (err) {
        console.error("Error in updating record:", err);
        res.status(500).send("Internal Server Error");
    }
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
