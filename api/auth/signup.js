
import { z } from "zod"
import { User } from "../../db/schema.js"
import express from "express"

export const routersignup = express.Router()

routersignup.post('/', async(req, res) => {
    try {
        const {name,email,role}=req.body
    
        const validation = z.object({
            name: z.string(),
            email: z.string().email(),
            role: z.enum(["user", "admin"])
        })
    
        validation.parse({name,email,role})
        
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
        
            return res.status(200).json({message: "signup successful"})
    } catch (error) {
        return res.status(400).json(`Error while signup || ${error}`)
    }
})
