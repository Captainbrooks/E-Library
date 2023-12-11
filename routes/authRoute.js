const {Router, response}=require("express");
const router=Router();
const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../model/user");
const Book=require("../model/book");
const {createToken}=require("../utils/utils");
const {requireAuth}=require("../utils/utils");
const multer=require("multer");
const mongoose=require("mongoose");
const UserMsg = require("../model/UserMessage");



// Routes for pages


router.get("/",(req,res)=>{
    res.render("partials/landingpage");
});


router.get("/landingpage",(req,res)=>{
    res.render("partials/landingpage");
});

router.get("/signup",(req,res)=>{
  res.render("partials/signup");
});


router.get('/login',(req,res)=> {
    res.render('partials/login');
});

router.get('/Contact', requireAuth, (req,res)=> {
    res.render('partials/Contact');
});

router.get('/about', requireAuth, (req,res)=> {
    res.render('partials/about');
});

router.get('/edit', requireAuth, (req,res)=> {
  res.render('partials/edit');
});



router.get('/home', requireAuth, (req,res)=> {
    res.render('partials/home');
});


router.get("/logout",(req,res)=>{
  res.cookie('jwt','',{expires:new Date(0)});
    res.render("partials/landingpage");
})








router.post('/signup', async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;
  
   
      const new_user = new User({ firstname, lastname, email, password });
  
      await new_user.save();


      const token=createToken(new_user._id);
      res.cookie("jwt",token,{httpOnly:true,maxAge:3*24*60*60*1000});
   


   


  
      console.log('User successfully created:', new_user);
      
      res.redirect("/home");
 

    } catch (error) {
      console.log(error);

       res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  
  
  router.post("/login",async(req,res)=>{
  try {
    const {email,password}=req.body;
    const user=await User.login(email,password);
    if(!user){
      res.json({message:"Either User is not registered or  Email/Password is Incorrect"});
    }
    else{
        const token=createToken(user._id);
      res.cookie("jwt",token,{httpOnly:true,maxAge:3*24*60*60*1000});
      res.status(201).json({user:user._id});
      res.redirect("/home")
     
    }
  } catch (error) {
    console.log(error);
    res.json({message:"Either User is not registered or  Email/Password is Incorrect"});
  }
    
  
  });



  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});



const upload = multer({ storage: storage });




//   route to add a book into a datbase through frontend

  router.post("/addbook", upload.fields([{name:"bookinfo",maxCount:1},{name:"bookimg",maxCount:1}]) ,async (req,res)=>{


    const { bookinfo,bookimg }=req.files;

    console.log(req.files);

    try {
        const {title,author,genre,url}=req.body;

        console.log(title,author,genre,url,bookinfo,bookimg);
       

        const newbook= new Book({
            title,
            author,
            genre,
            url,
            fileUrl:bookinfo[0].path,
            imageUrl:bookimg[0].path
        });

        await newbook.save();
        res.redirect("/home");

     
      
        console.log("book has inserted into database successfully",newbook);

       
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("Internal Server Error");
    }
  });




  router.get("/showBook",async(req,res)=>{
    const books=await Book.find({});

    try{
        if(books.length>0){
            res.json(books);
        }
        else{
            res.status(404).json({ message: "No books found." });
        }
       
    }catch(e){
        console.log(e);
    }
  });






  router.get("/delete/:id", async (req, res) => {
    try {
        const { id: bookId } = req.params;
  
      // Find the book by ID and remove it from the database
      const deletedBook = await Book.findByIdAndDelete(bookId);
  
      if (!deletedBook) {
         res.status(404).json({ message: 'Book not found.' });
      }
      else{
        res.redirect("/home");

      }
  
      
    
     
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  





  router.get('/search', async (req, res) => {
    const searchTerm = req.query.term; 

    try {
       
        const foundBooks = await Book.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } }, 
                { author: { $regex: searchTerm, $options: 'i' } }, 
                { genre: { $regex: searchTerm, $options: 'i' } }, //
            ]
        });

        res.status(200).json(foundBooks);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/edit/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId); 

    res.render('partials/edit', { book }); 
  } catch (error) {
    console.error('Error editing book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post("/update/:id", upload.fields([{name:"bookinfo",maxCount:1},{name:"bookimg",maxCount:1}]), async (req,res)=>{
  try {

    console.log("update route reached");
      const bookId = req.params.id;
      const { title, author, genre, url } = req.body;
      let fileUrl, imageUrl;


      if (req.files && req.files.bookinfo) {
          fileUrl = req.files.bookinfo[0].path;
      }


      if (req.files && req.files.bookimg) {
          imageUrl = req.files.bookimg[0].path;
      }

    
      const updatedBook = await Book.findByIdAndUpdate(
          bookId,
          { title, author, genre, url, fileUrl, imageUrl },
          { new: false }
      );

      if (!updatedBook) {
          return res.status(404).json({ message: 'Book not found.' });
      }

      console.log(updatedBook);

      res.redirect("/home");
 
  } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post("/usermessage" ,async (req,res)=>{


  try {
      const {fname,lname,Phone,useremail,msg}=req.body;

    
     

      const newMessage= new UserMsg({
          fname,
          lname,
          Phone,
          useremail,
          msg
        
      });

      await newMessage.save();
      res.redirect("/home");

   
    
      console.log("Message has  been sent successfully",newMessage);

     
  } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).send("Internal Server Error");
  }
});


module.exports=router;



  











