import exp from 'express'
import {UserModel} from '../Models/UserModel.js'
import {hash, compare} from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from './middlewares/verifyToken.js'
import cookieParser from 'cookie-parser'    



export const userApp = exp.Router()


//create user
userApp.post('/users', async(req, res) => {
    //get newuser from req 
    let newUser= req.body;
    //create newuser document
    //hash password
    let hashedPassword = await hash(newUser.password, 6);
    //replace plain password with hashed password
    newUser.password = hashedPassword;
    
    //save in db
    let newUserDoc = new UserModel(newUser);
    await newUserDoc.save();
    //send response
    res.status(201).json({message: "user created"})
});

//read user
userApp.get('/users', async(req, res) => {
    //read users from db
    let usersList = await UserModel.find({},{})
    res.status(200).send({message: "Users", payload: usersList})
})

//----------------------------------------------------------------------------------------------
//User authentication route
userApp.post('/auth', async(req, res) => {
    //get user cred object from req body
    let {username, password} = req.body;
    //check for username
    let userCred = req.body;
    let userOFDB = await UserModel.findOne({username: userCred.username});
    if(userOFDB === null){
        //username not found
        return res.status(404).json({message: "Invalid username"})
    } 
    //compare passwords
    let status = await compare(userCred.password, userOFDB.password);
    if(status === false){
        //passwords do not match
        return res.status(401).json({message: "Invalid password"})
    }
 


//create signed token
let signedToken =jwt.sign({username:userCred.username}, 'abcdef', {expiresIn: '1h'});
//save token as httpOnly, so we need to call response called cookie method
res.cookie('token', signedToken, 
    {httpOnly: true, 
    secure: false,
    sameSite: 'lax' // lax- provides moderate level security
    
});
   
//send response
res.status(200).json({message: "Login successful"})
 });

    //read user by obj id
    userApp.get('/users/:id', async(req, res) => {
        //get obj id from url parameter
        let objId = req.params.id;
        //find user in db
        let userObj = await UserModel.findById(objId);
        //send response
        res.status(200).json({message: "User", payload: userObj})
        })



//test route 
userApp.get('/test', verifyToken, (req, res) => {
    res.json({message: "test route"})
    })

//update user 
userApp.put('/users/:id', async(req, res) => {
    //get obj id from url parameter
    let objId = req.params.id;
    //get updated user from req body
    let ModifiedUser = req.body; 
    //update user in db
    let latestUser =await UserModel.findByIdAndUpdate(objId, {$set: {...ModifiedUser}}, {new: true});
    //send response
    res.status(200).json({message: "User modified", payload: latestUser})
})


//delete user

userApp.delete('/users/:id', async(req, res) => {
    //get obj id from url parameter
    let objId = req.params.id;
    //delete user from db
    let deletedUser = await UserModel.findByIdAndDelete(objId);
    //send response
    res.status(200).json({message: "User removed", payload: deletedUser})

})
