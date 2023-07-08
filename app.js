const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies

mongoose.connect("mongodb://localhost:27017/toDoList", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const schema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", schema);

const item1 = new Item({
  name: "What to do next?"
});

const item2 = new Item({
  name: "How are you doing today?"
});

const item3 = new Item({
  name: "How to be humble?"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then((result) => {
            console.log("Tasks saved successfully", result);
          })
          .catch((error) => {
            console.error("Error saving task", error);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", Added: foundItems });
      }
    })
    .catch((error) => {
      console.error("Error finding items", error);
    });
});

app.post("/", function (req, res) {
  let itemName = req.body.newItem;
  let item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.get("/work", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then((result) => {
            console.log("Tasks saved successfully", result);
          })
          .catch((error) => {
            console.error("Error saving task", error);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Work List", Added: foundItems });
      }
    })
    .catch((error) => {
      console.error("Error finding items", error);
    });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    defaultItems.push(item);
    res.redirect("/work");
  } else {
    newItem.push(item);
    res.redirect("/");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});


app.post("/delete", function(req, res){
    console.log(req.body)
})

app.listen(3001, function () {
  console.log("Server is listening on port 3001");
});
