import mongoose  from "mongoose";
const Schema= mongoose.Schema;

const messageSchema=new Schema({
    content:
    {
        type:String,
    },
    time:{
        type:Date,
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reciever:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }

})

export const Message = mongoose.model("Customer", messageSchema);