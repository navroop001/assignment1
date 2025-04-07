const express=require("express");
const cors=require("cors");
const fs=require("fs");
const app=express();
const corsOptions = {
    origin: '*',
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  //middlewares
  app.use(cors(corsOptions));
 app.use(express.json());

//readfile by get 
 app.get('/eventeees',(req,res)=>{
  fs.readFile('eventeees.json',(err,data)=>{
    if(err) res.status(500).send("Error Occured");
    try{
        
        const eventeees=res.json(data);
        res.json(eventeees);
    }catch(e){
        res.status(500).send("Invalid status ");
    }
});
 });


 //readfile for posst
 app.post('/eventeees',(req,res)=>{
 const newEvent=req.body;
 fs.readFile('eventeees.json',(err,data)=>{
 if(err) res.status(500).send("Err Occured Again");
 //empty object is created
 let eventeees=[];
 try{
    //jkar data d length 0 to vaddi a te fer json vich data chl jawe
    if (data.length > 0) {
        eventeees = JSON.parse(data);
      }
 }catch(e){
    res.status(500).send("Invalid status ");
 }
 //new array vich saari body paado
 eventeees.push(newEvent);
 //object will coverted into string bcz we cant directly pass object
 fs.writeFile('eventeees.json', JSON.stringify(eventeees, null, 2), err => {
       if (err) return res.status(500).send('Error writing file');
       res.json({
         message: 'User added successfully',
         eventeees: newEvent
       });
     });
 });
});