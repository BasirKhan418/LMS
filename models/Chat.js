import mongoose,{Schema} from "mongoose";
const ChatSchema = new Schema({
name:{type:String,required:true},
groupid:{type:Schema.Types.ObjectId,required:true,ref:'Team'},
message:{type:String,required:true},
sender:{type:Schema.Types.ObjectId,required:true,ref:'User'},
timestamp:{type:Date,default:Date.now},
}, { timestamps: true });
export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);