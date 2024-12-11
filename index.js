import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { user } from './api/user/unprotectedapi.js'
import { admin } from './api/admin/protectedapi.js'
import { routerotp } from './api/auth/otp.js'
import { routersignin } from './api/auth/signin.js'
import { routersignup } from './api/auth/signup.js'
import connectDb from './db/db.js'
import { otpclean } from './utils/clearotp.js'


dotenv.config()

connectDb()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use('/api/v1/user', user)
app.use('/api/v1/admin',admin)
app.use('/api/v1/auth/otp',routerotp)
app.use('/api/v1/auth/signup',routersignup)
app.use('/api/v1/auth/signin',routersignin)

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})