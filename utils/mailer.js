import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const sendMail = async(otp,email)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
          });
    
        const info = await transporter.sendMail({
            from: `"OTP Services" <${process.env.MAIL_USER}>`, 
            to: email, 
            subject: "OTP SIGNUP", 
            text: `OTP IS : ${otp}`, 
        });
        return true
    
    }catch{
        console.log(error)
        return false
    }
    
}
