var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect(
  "mongodb+srv://admin:123@cluster0.scavp.azure.mongodb.net/contact_manager?retryWrites=true&w=majority"
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image:
//     "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&h=350",
//   body: "This is a test blog",
// });

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.post("/blogs", function (req, res) {
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  Blog.create(
    {
      title,
      image,
      body,
    },
    function (err, blog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs");
      }
    }
  );
});

app.get("/blogs/new", function (req, res) {
  res.render("new");
});

app.get("/blogs/:id", function (req, res) {
  var id = req.params.id;
  Blog.findById(id, function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { blog: blog });
    }
  });
});

app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { blog: blog });
    }
  });
});

app.post("/blogs/:id", function (req, res) {
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var obj = { title, image, body };
  Blog.findByIdAndUpdate(req.params.id, obj, function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, function () {
  console.log("started server...");
});
