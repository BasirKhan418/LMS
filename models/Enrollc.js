import mongoose, { Schema } from "mongoose";

const EnrollcSchema = new mongoose.Schema({
    userid: { type: Schema.Types.ObjectId, ref: 'Users' },
    email: { type: String },
    courseid: { type: Schema.Types.ObjectId, ref: 'Courses' },
    assignMentor: { type: String },
    project: { type: Array },
    assignMent: { type: Array },
    score: { type: Number, default: 0 },
    progress:{type:Number,default:0},
    crcmp: {
        type: [Object],
        default: []
      },//crcmp stands for course complete
    rank: { type: String },
}, { timestamps: true });

export default mongoose.models.Enrollc || mongoose.model('Enrollc', EnrollcSchema);
