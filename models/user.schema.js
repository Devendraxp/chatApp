import mongoose  from "mongoose";
const Schema= mongoose.Schema;

const userSchema=new Schema({
    username:
    {
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    history:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }

})

export const User = mongoose.model("Customer", userSchema);