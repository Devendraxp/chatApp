import mongoose  from "mongoose";
const Schema= mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema=new Schema({
    email:{
        type:String,
    },
    history:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }

})
userSchema.plugin(passportLocalMongoose);

export const User = mongoose.model("User", userSchema);