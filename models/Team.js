import mongoose from "mongoose";
const BatchSchema = new mongoose.Schema({
 teamname:{type:String,required:true},
 batchid:{type:ObjectId,required:true,ref:'Batch'},
 teamleaderid:{type:ObjectId,required:true,ref:'Users'},
 team:{type:Array,required:true,ref:'Users'},
}, { timestamps: true });
export default mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
