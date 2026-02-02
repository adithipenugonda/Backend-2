import exp from 'express'
import { userApp } from './APIs/UserAPI.js';
import {connect} from 'mongoose'
import cookieParser from 'cookie-parser';
const app = exp()

//connect to mongodb server
async function connectDB() {
  try {
    //connect mongoose to MongoDB
    await connect("mongodb://localhost:27017/anuragdb2");
    console.log("Connected to MongoDB server successfully");
    //start server after successful DB connection
    app.listen(port, () => {
      console.log("Server is running on port: 4000");
    });
  } catch (err) {
    //if DB connection fails
    console.log("Error connecting to MongoDB server", err);
  }
}



connectDB()
app.use(exp.json());
//add cookieparser middleware
app.use(cookieParser());

//if path starts with /user-api, forward the request to userApp
app.use("/user-api", userApp);
//if path starts with /product-api, forward the request to productApp
import { productApp } from './APIs/ProductAPI.js';

app.use("/product-api", productApp);
//body parser middleware


//error handling middleware
function errorHandler(err, req, res, next) {
    console.log("Error is: ", err.message);
    res.status(500).json({message: "Error", errorDetails: err.message})
}


//assign port
const port = 4000;
app.listen(port, () => {
    console.log("Server is running on port: 4000");
});