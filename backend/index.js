const express = require('express')
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const cors = require('cors')
const authController = require('./controllers/authController.js')
const blogController = require('./controllers/blogController.js')
const multer = require('multer')

dotenv.config()
const app = express()
const port = process.env.PORT || 8000;

// connect db
mongoose.set("strictQuery" , false)
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      console.log("Mongodb connected");
  } catch (error) {
    console.log(error,"Eror connecting in DB")
  }
}

// routes
app.use('/images', express.static('public/images'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/blog', blogController)

// multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images')
    },
    filename: function(req, file, cb){
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage: storage
})

app.post('/upload', upload.single("image"), async(req, res) => {
    return res.status(200).json({msg: "Successfully uploaded"})
})

// connect server
app.listen(port, ()=> {
    connect()
    console.log('Server started', port)
})