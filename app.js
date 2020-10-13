    let express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    path = require('path'),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");

    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "views")));
    // mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true, useUnifiedTopology: true})
    // .then(() => {
    //     console.log("Success");
    // })
    // .catch((err) => {
    //     console.log('Error:', err.message);
    // });
    mongoose.connect(`mongodb+srv://Jordan:Bl0g@cluster0.df1ah.mongodb.net/cluster0?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log("Success");
    })
    .catch((err) => {
        console.log(err);
    });
    mongoose.set("useFindAndModify", false);
    app.use(methodOverride("_method"));
    app.use(bodyParser.urlencoded({extended: true}));

    // Mongoose/Model Config

    let blogPost = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {type: Date, default: Date.now}
    });

    
    let Blog = mongoose.model("blog", blogPost);

    // // ROUTES

    // // Index
    app.get("/", (req, res) => {
        Blog.find({}, (err, blogs) => {
            if(err){
                console.log(`Error has occured. ${err}`);
            }else{
                res.render("index", {blogs: blogs});
            }
        });
    });

    // New Blog
    app.get("/new", (req, res) => {
        res.render("new.ejs")
    });

    // Create Blog
    app.post("/create", (req, res) => {
        Blog.create(req.body.blog, (err, created) => {
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            }
        });
    });

    // Show Blog
    app.get("/show/:id", (req,res) => {
        let id = req.params.id;
        Blog.findById(id, (err, post) => {
            if(err){
                console.log(err);
            }else{
                res.render("show", {post: post});
            }
        });
    });

    // Edit Blog
    app.get("/edit/:id", (req, res) => {
        const id = req.params.id;
        Blog.findById(id, (err, found) => {
            if(err){
                console.log(err);
            }else{
                res.render("edit", {post: found});
            }
        });
    });

    app.put("/:id", (req, res) => {
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updated) => {
            if(err){
                console.log(err);
            }else{
                res.redirect(`/show/${req.params.id}`);
            }
        });
    });

    // Delete Post
    app.delete("/delete/:id", (req, res) => {
        Blog.findByIdAndRemove(req.params.id, (err, deleted) => {
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            }
        });
    });

    let PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server on port ${PORT}`);
    });