import express from 'express'
import { expressjwt } from 'express-jwt'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import * as jwt from 'jsonwebtoken'
import { User } from './schema'

dotenv.config()

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.post('/signup', (req, res) => {
    const {name,email,role}=req.body
    const otp = (Math.random * 1000000)-1
    const token = jwt.sign({name,email},process.env.JWT_SECRET)
    const user = new User({
        name,
        email,
        role,
        otp
    })
    user.save()
    res.cookie('token',token,{
        httpsOnly: true
    })
    res.json({message: "login successful"})
})

app.post('/login',jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}), (req, res) => {
    if (!req.auth.name){
        res.redirect('/signup')
    }
    const name = req.auth.name
    User.findOne({name})
    .then((user)=>{
        if(req.body.otp === user.otp){
            const token = jwt.sign({name, email, role}, process.env.JWT_SECRET)
            res.cookie('token',token,{
                httpsOnly: true
            })
            res.json({message: "login successful"})
        }else{
            res.json({message: "Otp wrong"})
        }
    })
    .catch((err)=>{
        console.log(err)
        res.json({message: "login failed"})
    })
})

app.get('/admin',jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}), (req, res) => {
    if (req.auth.role === 'admin'){
        res.json({message: "Welcome admin"})
    }else{
        res.json({message: "You are not admin"})
        res.redirect('/login')
    }
})