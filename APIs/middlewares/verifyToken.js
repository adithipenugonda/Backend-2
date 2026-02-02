import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
export function verifyToken(req, res, next){
    //token verification logic


    //1. get token from req cookies(using cookie-parser)
    let signedToken = req.cookies.token;
    if(!signedToken){
        return res.status(401).json({message: "Please login first"})
    }



    //2. verify token(decode)
    let decodedToken = jwt.verify(signedToken, 'abcdef', (err, decodedToken) => {
        console.log("decoded token is: ", decodedToken);
        next();

    })
    
}