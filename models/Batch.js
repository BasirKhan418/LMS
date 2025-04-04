import mongoose from "mongoose";
const BatchSchema = new mongoose.Schema({
 name:{type:String,required:true},
 domain:{type:String,required:true},
 date:{type:Date,required:true},
}, { timestamps: true });
export default mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
