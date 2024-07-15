const Express = require('express');
const Mongoclient = require('mongodb').MongoClient;
var cors=require("cors");
const multer=require("multer");

var app=Express();
app.use(cors());

var CONNECTION_STRING="mongodb+srv://sunayanalakki:LHHrqzG8YQHO675K@cluster0.u9lxkdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


var DATABASENAME="techdenali";
var database;

app.listen(5038,()=>{
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database=client.db(DATABASENAME);
        console.log("Mongo DB Connection Successful");
    })
})

// app.get('/api/techdenali/users',(request,response)=>{
// database.collection("techdenali").count({},function(error,numOfDocs){
// response.send(result)
// })
// })
app.get('/api/techdenali/users',(request,response)=>{
    database.collection("techdenali").count({},function(error,numOfDocs){
        response.send(numOfDocs); // Sending numOfDocs instead of result
    });
});
