import { authJWT } from '../../utils/helper.js'
import express from 'express'

export const admin = express.Router()

admin.get('/',authJWT, (req, res) => {
    try {
        if(!req.auth){
            res.status(401).json({message: "Please login"})
        }
        if (req.auth.role !== 'admin'){
            return res.status(300).json({message: "UnAuthorized"})
        }else{
            return res.status(200).json({message: "Hello admin"})
        }
    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
})