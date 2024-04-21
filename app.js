const express = require("express");
const connectDB = require("./db");
const path = require('path')
const Post = require("./models/postModel");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

const session = require('express-session');
const flash = require('connect-flash')

// mongodb session 
const mongoDBSession = require('connect-mongodb-session')(session)

// mongoDB session store
const store = mongoDBSession({
    uri: 'mongodb://127.0.0.1:27017/music_connect_db',
    collection: 'musicSessions'
})

//Init app & middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup sessions
app.use(session({
  secret: 'secret',
  cookie:{
      maxAge: 7 * 24 * 60 * 60 * 1000
  },
  resave: false,
  saveUninitialized: false,
  store: store
}))

// connect db
connectDB();

// set engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(flash())


//routes
app.get('/', async (req, res)=>{
  const posts = await Post.find()
  const is_authenticated = req.session.isAuth;
  const username = req.session.username
  
  const context = {
    success: req.flash("success"), 
    error: req.flash("error"), 
    is_authenticated,
    username
  }
  res.render('index.ejs', context)
})

// register user
app.post('/M00914279/user/register', async (req, res)=>{
  const {username, email, fname, lname, password1} = req.body
  
  if(!username || !email || !fname || !password1){
      res.status(400)
      throw new Error(`Please body can't be empty`)
  }

  // check if user already exist
  const userExist = await User.findOne({email})
  if(userExist){
      res.status(400)
      req.flash('error', "User already exist, login.")
      return res.redirect('/')
  }


  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashed_password = await bcrypt.hash(password1, salt)

  // create user
  const user = await User.create({
      username,
      fname,
      lname,
      email,
      password: hashed_password
  })
  if (user){
    res.status(201)
    req.flash("success", `Registration successful for ${username}.`)
    return res.redirect('/')
  }
  else{
      res.status(400)
      throw new Error("Invalid user data.")
  }
})

// @desc get posts
// @route GET /api/MM00914279/login
app.post('/M00914279/login', async (req, res)=>{
  const {username, password} = req.body;

  console.log(req.body)

  // check if field is ready
  if(!username || !password){
      res.status(400)
      req.flash('error', "username or password can't be empty")
      return res.redirect('/')
  }

  // Return the user
  const user = await User.findOne({username})

  // check if user doesnt exist
  if(! user){
      res.status(400)
      req.flash('error', "Incorrect username or password")
      return res.redirect('/')
  }
  
  // check if password is match
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
      res.status(400)
      req.flash('error', "Incorrect password")
      return res.redirect('/')
  }

  // log in user and set is Auth to true
  res.status(200)
  req.flash('success', `${user.username}, you logged In.`)
  req.session.isAuth = true;
  req.session.fullname = user.fname + " " + user.lname
  req.session.username = user.username
  req.session.id = user.id
  return res.redirect('/')
})


// @desc logout user
// @route POST /api/M00914279/log out
app.post('/M00914279/logout', async (req, res)=>{
  req.session.destroy(err =>{
      if(err) throw err;
      return res.redirect("/");
  })
})


// user post content
app.post('/M00914279/create/post', async (req, res)=>{
  const {title, content} = req.body

  if(!title || !content){
      res.status(400)
      throw new Error(`Please title and author can't be empty.`)
  }

  const username = req.session.username;
  const author = await User.findOne({username})

  // create post
  const post = await Post.create({
      author,
      title,
      content
  })

  if (post){  
    res.status(201);
    req.flash('success', `Post ${post.title} created!`)

    return res.redirect('/')
  }
  else{
      res.status(400)
      throw new Error("Invalid post data.")
  }
})


// edit post
app.put('/M00914279/update/post/:id', async (req, res)=>{
  const post = await  Post.findById(req.params.id)

  if(!post){
      res.status(400)
      throw new Error(`Post not found`)
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true
  })
  
  res.status(200).json(updatedPost)
})


app.listen(5050, () => {
  console.log("App is listening on port 5050");
});
