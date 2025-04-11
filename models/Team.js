import mongoose from "mongoose";
import { Schema } from "mongoose";
const TeamSchema = new Schema({
 teamname:{type:String,required:true},
 batchid:{type:Schema.Types.ObjectId,required:true,ref:'Batch'},
 teamleaderid:{type:Schema.Types.ObjectId,required:true,ref:'User'},
 team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 month:{type:String,required:true},
}, { timestamps: true });
export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
