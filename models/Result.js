import mongoose from "mongoose";
import { Schema } from "mongoose";
const ResultSchema = new Schema({
 duration:{type:String,required:true},
 status:{type:String,required:true},
 batchid:{type:Schema.Types.ObjectId,required:true,ref:'Batch'},
 users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 results:{type:Array,default:[]},
 url:{type:String,default:""},
}, { timestamps: true });
export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
