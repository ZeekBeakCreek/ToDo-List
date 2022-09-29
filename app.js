const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoList"),
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  };

const itemsSchema = { name: String };
const Item = mongoose.model("items", itemsSchema);
const defautltOne = new Item({ name: "Welcome to your todolist!" });
const defautltTwo = new Item({ name: "Hit the + button to add a new item." });
const defautltThree = new Item({ name: "👈 Hit this to delete an item." });
const defaultItems = [defautltOne, defautltTwo, defautltThree];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        console.log("Successfully Updated Default DB Values To List");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "TODO", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  console.log(req.body);
  const item = new Item({ name: itemName });
  if (listName === "TODO") {
    item.save();
    res.redirect("/");
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "TODO") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  }
});

app.get("/edit", function (req, res) {
  Item.find({}, function (err, foundItems) {
    res.render("edit", { listTitle: "TODO", oldListItems: foundItems });
  });
});

app.post("/edit", function (req, res) {
  const eyeDee = req.body.eyeD;
  const edits = `${req.body.addedVals}`;

  str = edits;
  console.log("Original String: ", str);
  newStr = str.replaceAll("," , "");

  Item.findByIdAndUpdate(eyeDee, { name: newStr }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated User : ", docs);
    }
    res.redirect("/edit");
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});