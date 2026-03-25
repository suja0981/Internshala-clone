const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const {connect} = require('./db');
 const router=require("./Routes.js/index");

const port=5000;
app.use(cors());
app.use(bodyparser.json({limit:'50mb'}));
app.use(bodyparser.urlencoded({limit:'50mb',extended:true}));
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.use('/api',router);

connect();
app.use((req,res,next)=>{
    req.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Origin","*");
    next();
}
);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});