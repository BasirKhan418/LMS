import mongoose,{Schema} from "mongoose";
const TrainerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    token: { type: String, required: true },
    batches: { type: Array, required: true },
},{ timestamps: true })
export default mongoose.models.Trainer || mongoose.model("Trainer",TrainerSchema);