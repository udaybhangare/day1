
import { User } from "../db/schema.js"


export const otpclean = async()=> {
    try {
        const users = await User.find({otp:{$exists:true}});

        for (let user of users) {
            if (user.otp && user.otpExpiry && user.otpExpiry<Date.now()){
                user.otp = undefined;
                user.otpExpiry = undefined;

                await user.save();
                console.log(`OTP for user ${user.email} cleaned up.`);
            }
        }
        console.log("OTP Cleanup Completed.");
    } catch (error) {
        console.error("Otp Cleanup Error", error);
    }
};

