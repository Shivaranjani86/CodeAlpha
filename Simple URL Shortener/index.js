// @ts-nocheck
const express = require("express");
const urlRoute = require('./routes/url');
const {connectToMongoDB}= require("./connect");
const URL = require('./models/url');
const path = require('path');
const staticRouter = require('c:/Users/shiva/Desktop/ShortnerURL/routes/staticrouter')
const app = express();
const PORT = 8001;
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=> console.log("Mongodb Connected"));
app.use(express.json()) 
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs");
app.set('views',path.resolve("./views"));
app.use("/",staticRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/url',urlRoute);
app.get('/url/:shortId',async (req,res)=> {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push:
        {
        visitHistory:[{
            timestamp:Date.now(),
        }],
    } ,
}
);
    res.redirect(entry.redirectURL)
});



app.listen(PORT,() => console.log("Server Started at PORT:8001"));