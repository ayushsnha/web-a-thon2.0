var  express      =require("express"),

	 mongoose     =require("mongoose"),
	 passport     =require("passport"),
	 bodyParser   =require("body-parser"),
	 User 		  =require("./models/user"),
	 LocalStrategy=require("passport-local"),
	 passportLocalMongoose=require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/devfest");


var app=express();
app.use(require("express-session")({

	secret:"devfest",
	resave:false,
	saveUninitialized:false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES

app.get("/",function(req,res){

	res.render("index");
});

app.get("/main",isLoggedIn,function(req,res){
	res.render("main");
});

//AUTH routes
//form
app.get("/signup",function(req,res){
	res.render("signup");
});

//handling user signup
app.post("/register",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){

		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/main");
		});
	});
});

//LOGIN ROUTES
app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{

	successRedirect:"/main",
	failureRedirect:"/login",
}),function(req,res){

});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
//MIDDLEWARE

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000,function(){

	console.log("server has started");
});
