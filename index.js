import connectDb from './db.js'
import {User} from './schema.js'

async function main() {
    await connectDb()
    // const user = new User({
    //     name: 'Jo',
    //     email: 'john.do@exple.co',
    //     role: 'admn',
    //     otp: 12346,
    // })
    // user.save()
    // .then(()=>console.log('User saved'))
    // .catch(err=>console.log(err))

    // Assuming you're in an async function
try {
    const test = await User.findById('6755736a1c54ee4d32af1340');  // Use await to get the user

    if (!test) {
        console.log('User not found');
    } else {
        console.log(test);

        // Now compare otpExpiry with Date.now()
        if (test.otpExpiry.getTime() > Date.now()) {
            console.log('OTP is valid');
        } else {
            console.log('OTP is expired');
        }
    }
} catch (err) {
    console.log('Error:', err);
}

}

main()
