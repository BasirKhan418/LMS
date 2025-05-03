import mongoose from "mongoose";
import { Schema } from "mongoose";
const AttendanceSchema = new Schema({
 weekname:{type:String,required:true},
 duration:{type:String,required:true},
 batchid:{type:Schema.Types.ObjectId,required:true,ref:'Batch'},
 users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 courseid:{type:Schema.Types.ObjectId,required:true,ref:'Course'},
 classid:{type:String,required:true},
}, { timestamps: true });
export default mongoose.models.Attendance|| mongoose.model('Attendance', AttendanceSchema);
