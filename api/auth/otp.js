import express from "express"
import { z } from "zod"
import { User } from "../../db/schema.js"
import { otpgen } from "../../utils/otpgen.js"
import { sendMail } from "../../utils/mailer.js"
export const routerotp = express.Router()

routerotp.get('/',async(req,res)=>{
    try {
        const {email} = req.query

        const validation = z.object({
            email: z.string().email()
        })

        validation.parse({email})
    
        const user = await User.findOne({email})
    
        if(!user){
            return res.status(404).json({message: "user not found. please signup"})
        }
        const otp = otpgen()

        await sendMail(otp,email)
    
        user.otp = otp
        user.otpExpiry = expiry()

        await user.save()
    
        return res.status(200).json({message: "otp sent"})
    } catch (error) {
        return res.status(500).json({message: "otp failed"})
    }
})


function expiry(){
    return Date.now() + (5*60*1000)
}