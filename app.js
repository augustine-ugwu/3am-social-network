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
  
  const context = {
    success: req.flash("success"), 
    error: req.flash("error"), 
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


// user post content
app.post('/M00914279', async (req, res)=>{
  const {author, title, content} = req.body
  
  if(!title || !content){
      res.status(400)
      throw new Error(`Please title and author can't be empty.`)
  }

  // create post
  const post = await Post.create({
      author,
      title,
      content
  })

    res.status(201).json({
        _id: post.id,
        title: post.title,
        content : post.content
    })
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
