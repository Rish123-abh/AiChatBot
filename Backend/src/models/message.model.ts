import mongoose,{Schema} from "mongoose";

export interface IMessage extends Document{
    role: "user" | "ai",
    message?:string,
    userId:string,
    createdAt?:Date,
    updatedAt?:Date,
}
const messageSchema=new Schema({
     userId: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["user", "ai"], required: true },
    message:{type:String,required:true},
},{
    timestamps:true
})

const Message=mongoose.model<IMessage>('Message',messageSchema);
export default Message;