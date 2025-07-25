import mongoose, { Schema } from "mongoose";

const SubmittedSchema = new Schema({
  asid: { type: Schema.Types.ObjectId, ref: 'Assignments' },
  crid: { type: Schema.Types.ObjectId, ref:"Courses" },
  userid: { type: Schema.Types.ObjectId, ref: 'User' },
  response: {
    type: String,
  },
  status: {
    type: String,
    default: "submitted"
  },
  marks: {
    type: String,
    default: "0"
  },
}, { timestamps: true });

export default mongoose.models.SubmittedAssignments || mongoose.model("SubmittedAssignments", SubmittedSchema);
