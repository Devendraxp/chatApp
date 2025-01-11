import mongoose  from "mongoose";
const Schema= mongoose.Schema;

const otpSchema=new Schema({
    sessionId:{
        type:String,
    },
    otp:{
        type:Number,
    }

})

export const User = mongoose.model("Customer", otpSchema);