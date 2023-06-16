// Task1: initiate app and run server at 3000
const express=require('express');
const app=new express();
require('dotenv').config();
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    try {
        console.log(`Server running on PORT ${PORT}`);
    } catch (error) {
        console.log(`Server error`); 
    }
})

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));


// Task2: create mongoDB connection 
const mongoose=require('mongoose');
mongoose.connect(process.env.mongodb_url)
.then(()=>{
    console.log('Connected to local DB');
})
.catch(()=>{
    console.log('Error!!! Connection lost');
})
const Schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    }
});
const employeeData=mongoose.model('Employeedata',Schema);


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
app.use('/api',router);


//TODO: get data from db  using api '/api/employeelist'
router.get('/employeelist',async (req,res)=>{
    try {
        const data= await employeeData.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json('Cannot retrieve data');
    }
})


//TODO: get single data from db  using api '/api/employeelist/:id'
router.get('/employeelist/:id',async (req,res)=>{
    const id=req.params.id;
    try {
        const data= await employeeData.findById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json('Cannot retrieve data');
    }
})


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
router.post('/employeelist',async (req,res)=>{
    try {
        const item=req.body;
        const newdata= new employeeData(item);
        const saveData= await newdata.save();
        res.status(200).json('POST Successful');
        console.log(req.body)
    } catch (error) {
        res.status(400).json('Cannot create data');
    }
})


//TODO: delete a employee data from db by using api '/api/employeelist/:id'
router.delete('/employeelist/:id',async (req,res)=>{
    const ind=req.params.id;
    try {
        const erase= await employeeData.findByIdAndDelete(ind);
        res.status(200).json('DELETE Successful');
    } catch (error) {
        res.status(400).json('Cannot delete data');
    }
})


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
router.put('/employeelist',async (req,res)=>{
    try {
        const index=req.body.ind;
        const {name,location,position,salary}=req.body;
        if(!name||!location||!position||!salary){
            return res.status(400).json('Required field is empty');
        }
        const updated= await employeeData.findOne(
            {"ind":index},
            {$set:{"name":name,"location":location,"position":position,"salary":salary}}
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json('Cannot update data');
    }
})


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



