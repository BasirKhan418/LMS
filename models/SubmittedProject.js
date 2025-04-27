import mongoose from "mongoose";
const ProjectSubmittedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  link2:{
    type:String,
    required:true
  },
  crid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
  },
  pid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project"
  },
  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  mark:{
    type:Number,
    default:0
  },
    status:{
        type:String,
        default:"pending"
    },
},{timestamps:true}); // collection
export default mongoose.models.SubmittedProject || mongoose.model("SubmittedProject",ProjectSubmittedSchema);