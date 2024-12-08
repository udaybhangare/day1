import mongoose,{Schema} from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    role: {
        type:String,
    },
    otp: {
        type:Number,
    },
    otpExpiry: {
        type:Date,
        default:function(){
            return Date.now() + (2*60*1000)
        }
    }
})

export const User = mongoose.model("User",userSchema)
