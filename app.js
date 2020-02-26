const bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      express       = require("express"),
      app           = express();

//**********APP CONFIG**********
//set template 
app.set("view engine", "ejs");
//look into public 
app.use(express.static("public"));
//use bodyparser
app.use(bodyParser.urlencoded({extended : true}));
//to remove deprecation warnings from mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);     
//database connection
mongoose.connect('mongodb+srv://dbiLongRanger:Converse5!@cluster0-6vapc.mongodb.net/dbRESTfulBlogApp?retryWrites=true&w=majority', { useNewUrlParser: true });
//to check if connection is okay
mongoose.connection
    .once("open", () => console.log("Connected to MongoDB Atlas"))
    .on("error", error => {
        console.log("Error", error);
    });

//**********MONGOOS/MODEL CONFIG**********
//**********SCHEMA**********
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created_at: {type: Date, default: Date.now} //will get the current date as the default value
    
})
//**********MODEL**********
const Blog = mongoose.model("Blog", blogSchema);

//**********RESTful ROUTES**********
app.get("/", function(req,res){
   res.redirect("/blogs"); 
});
//index - getting date from the database 
app.get("/blogs", function (req, res){
    Blog.find({},function (err, blogs){
     if(err){
         console.log("error retrieving data");
     }else{
          res.render("index", {blogs : blogs}); 
     }
    });
});
//NEW
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});
//CREATE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       }
    });
}); 
//SHOW 
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function (err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog : foundBlog});     
        }
    });
});
//server listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server Started!"); 
});

      
      