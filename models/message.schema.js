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
        type:ObjectId,
    },
    reciever:{
        type:ObjectId,
    }

})

export const Message = mongoose.model("Customer", messageSchema);