import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema({
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
    ref:"Courses"
  }
},{timestamps:true}); // collection
export default mongoose.models.Project || mongoose.model("Project",ProjectSchema);