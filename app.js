const express = require("express");
const connectDB = require("./db");
const Post = require("./models/postModel");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

//Init app & middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect db
connectDB;

//routes
app.get('/M00877074/posts', async (req, res)=>{
  const posts = await Post.find()
  res.status(200).json(posts)
})

// register user
app.post('/M00877074/user/register', async (req, res)=>{
  const {username, email, profile_info, password} = req.body
  
  if(!username || !email || !profile_info || !password){
      res.status(400)
      throw new Error(`Please body can't be empty`)
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashed_password = await bcrypt.hash(password, salt)

  // create user
  const user = await User.create({
      username,
      profile_info,
      email,
      password: hashed_password
  })

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email
    })
})


// user post content
app.post('/M00877074', async (req, res)=>{
  const {author, content} = req.body
  
  if(!author || !content){
      res.status(400)
      throw new Error(`Please body can't be empty`)
  }

  // create post
  const post = await Post.create({
      author,
      content
  })

    res.status(201).json({
        _id: post.id,
        content : post.content
    })
})


app.listen(4000, () => {
  console.log("App is listening on port 4000");
});
