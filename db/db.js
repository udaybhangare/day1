import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

function connectDb(){
    mongoose.connect(`${process.env.MONGO_URI}${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(()=>console.log('MongoDB Connected'))
    .catch(err=>console.log(err));
}

export default connectDb