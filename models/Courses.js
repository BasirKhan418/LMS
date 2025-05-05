import mongoose, { Schema } from "mongoose";

const CoursesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  skills: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  grouplink: { type: String, required: true },
  seats: { type: Number, required: true },
  duration: { type: String, required: true },
  isopen: { type: Boolean },
  discount: { type: Number },
  feature: { type: String },
  ytvideo: { type: String },
  startdate: { type: String },
  content: { type: Array },
  batch:  { type: Schema.Types.ObjectId, ref: 'Batch', required: false },
  domain: { type: String, required: false },
  coursetype: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Courses || mongoose.model('Courses', CoursesSchema);