import User from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";

export default (req,res,next) => {
    const auth = req.headers.authorization
    console.log(auth)
    if (!auth) {
        return res.status(401).json({
            success: false,
            message: 'invalid credentials!'
        })
    }
    const token = auth.split(' ')[1]
    jwt.verify(
        token,
        process.env.SECRET_KEY,
        async(error, credentials) => {
            // credentials son los datos destokenizados del token
            try {
                let user = await User.findOne({ email:credentials.email })
                req.user = user 
                return next() 
            } catch (error) {
                return res.status(401).json({
                 success: false,
                 message: 'error de autorizacion'
                })
            }   
        })
    }