import dotenv from 'dotenv'
import {expressjwt as jwt} from 'express-jwt'

dotenv.config()

export const authJWT = jwt({
    secret:`${process.env.JWT_SECRET}`, 
    algorithms:['HS256'],       
    requestProperty:'auth',     
    getToken:(req)=>req.cookies.token
  })