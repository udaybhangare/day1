import express from 'express'

export const user = express.Router()

user.get('/', (req, res) => {
    try {
        
        return res.status(200).json({message: "Hello user"})
        
    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
})