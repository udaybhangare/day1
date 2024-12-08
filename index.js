import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import * as jwt from 'jsonwebtoken'
import { User } from './schema.js'
import { sendMail } from './mailer.js'
import { authJWT } from './helper.js'

dotenv.config()

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.post('/signup', async(req, res) => {
    const {name,email,role}=req.body

    try {
        let userEmail = await User.findOne({email})
        let userName = await User.findOne({name})
    
        if(userEmail || userName){
            return res.status(300).json({message: "user already exists"})
        }
    
        const user = new User({
            name,
            email,
            role
        })
        await user.save()
    
        return res.json({message: "signup successful"})
    } catch (error) {
        return res.status(500).json({message: "signup failed"})
    }
})

app.post('/sendotp',async(req,res)=>{
    try {
        const {email} = req.body
    
        const user = await User.findOne({email})
    
        if(!user){
            return res.status(404).json({message: "user not found. please signup"})
        }
        const otp = (Math.random * 1000000)-1

        await sendMail(otp)
    
        user.otp = otp
        await user.save()
    
        return res.status(200).json({message: "otp sent"})
    } catch (error) {
        return res.status(500).json({message: "otp failed"})
    }
})

app.post('/login', async(req, res) => {
    try {
        const {email,otp}=req.body
    
        const user = await User.findOne({email})
    
        if(!user){
            return res.status(404).json({message: "user not found. please signup"})
        }
    
        if(!user.otp){
            // Ik ithe sentOtp cha function use kela pahije jo mi varti vaparla
            // But Rn im lazy af so mi return karnar :)
            return res.status(400).json({message: "otp not sent"})
        }
    
        if(user.otpExpiry < Date.now()){
            // Ik ithe sentOtp cha function use kela pahije jo mi varti vaparla
            // But Rn im lazy af so mi return karnar :)
            return res.status(400).json({message: "otp expired. pls gen new otp"})
        }
    
        if(user.otp !== otp){
            return res.status(400).json({message: "otp not matched"})
        }
    
        const token = jwt.sign({name: user.name,email: user.email, role: user.role}, process.env.JWT_SECRET)
    
        return res.status(200).cookie('token', token, {httpOnly: true}).json({message: "login successful"})
    } catch (error) {
        return res.status(500).json({message: "login failed"})
    }
})

app.get('/admin',authJWT, (req, res) => {
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


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})