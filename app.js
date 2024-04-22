const express = require("express");
const connectDB = require("./db");
const path = require('path')
const Post = require("./models/postModel");
const User = require("./models/userModel");
const Friend = require('./models/friendModel')
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
      .populate({path: 'author', select: 'fname lname email username'})
      .sort({createdAt: -1})
  const is_authenticated = req.session.isAuth;
  const username = req.session.username
  const users = await User.find({},
    {
       username:1, email:1, fname: 1, lname: 1
   })
  const friends = await Friend.find({},{sent_from:1, sent_to:1, status:1})  
    .populate({path: 'sent_from', select: 'fname lname email username'})
    .populate({path: 'sent_to', select: 'fname lname email username'})
    .sort({createdAt: -1})

    var filtered_users = [];
    users.forEach(user=>{
        if(user.username !== username){
            if(friends.length > 0){
                if(!(friends.filter(friend =>
                    (friend.sent_from.username === user.username) && (friend.sent_to.username === username)
                    || (friend.sent_from.username === username) && (friend.sent_to.username === user.username)).length > 0)){
                        filtered_users.unshift(user)
                    }
            }else{
                filtered_users.unshift(user)
            }
        }
    })
  
  const context = {
    success: req.flash("success"), 
    error: req.flash("error"), 
    is_authenticated,
    username,
    users,
    filtered_users,
    friends,
    posts
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


// @desc following system
// @route GET /
app.post('/M00914279/:username/follow', async (req, res)=>{
  const request_from = req.session.username
  const request_to = req.params.username

  // check if user trying to follow himself
  if(request_from === request_to){
      res.status(400)
      req.flash("error", `Can't follow yourself.`)
      return res.redirect('/')
  }
  const from_user = await User.findOne({username: request_from});
  const to_user = await User.findOne({username: request_to});

  const friends = await Friend.find({},{sent_from:1, sent_to:1, status:1})
  .populate({path: 'sent_from', select: 'fname lname email username '})
 .populate({path: 'sent_to', select: 'fname lname email username '})
  
  if(friends.length > 0){
      if(friends.filter(friend =>
          (friend.sent_from.username === from_user.username) && (friend.sent_to.username === to_user.username)
          || (friend.sent_from.username === to_user.username) && (friend.sent_to.username === from_user.username)).length > 0){
          res.status(400)
          req.flash("error", `already sent request to user.`)
          return res.redirect('/')
      }
  }
  
  const friend_request = await Friend.create({
      sent_from: from_user,
      sent_to: to_user
  })

  if(friend_request){
      res.status(201)
      req.flash("success", `request sent to ${to_user.username}.`)
      return res.redirect('/')
  }
})

// @desc following system
// @route confirm or decline request
app.post('/M00914279/confirm/', async (req, res)=>{
  const {choice, token} = req.body;

  // if choice is accepted
  if(choice === "accepted"){
      const accepted_req = await Friend.findByIdAndUpdate({_id: token}, {status: "accepted"});
      if(accepted_req ){
          res.status(201)
          req.flash("success", `Request Accepted.`)
          return res.redirect('/')
      }
  }

  // if choice is rejected
  else if(choice === "rejected"){
      const rejected_req = await Friend.findByIdAndUpdate({_id: token}, {status: "rejected"});
      if(rejected_req ){
          res.status(201)
          req.flash("error", `request rejected.`)
          return res.redirect('/')
      }
  }

})



app.listen(5050, () => {
  console.log("App is listening on port 5050");
});
