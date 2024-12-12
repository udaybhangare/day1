import jwt from 'jsonwebtoken'
import z from 'zod'
import express from 'express'
import dotenv from 'dotenv'
import { User } from '../../db/schema.js'
import axios from 'axios'
dotenv.config()
export const routersignin = express.Router()

routersignin.post('/', async(req, res) => {
    try {
        const {email, otp} = req.body
        const validation = z.object({
            email: z.string().email(),
            otp: z.string().length(6),
        })

        validation.parse({email,otp})
    
        const user = await User.findOne({email})
    
        if(!user){
            return res.status(404).json({message: "user not found. please signup"})
        }
    
        if(!user.otp || user.otpExpiry < Date.now()){
            await axios.get('http://localhost:3000/api/v1/auth/otp',{
                params:{email}
            });
            return res.status(400).json({message: "otp expired. new otp sent"})
        }
    
        if(user.otp != otp){
            return res.status(400).json({message: "otp not matched"})
        }
    
        const token = jwt.sign({name: user.name,email: user.email,role: user.role}, process.env.JWT_SECRET)

        user.otp = undefined
        user.otpExpiry = undefined
        user.save()
    
        return res.status(200).cookie('token', token, {httpOnly: true}).json({message: "login successful"})
    } catch (error) {
        return res.status(500).json({message: `lOGIN fAILED: ${error}`})
    }
})


