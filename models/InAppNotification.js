import mongoose,{Schema} from "mongoose";
const InAppNotificationSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sentTime:{ type: Date, required: true },
    category: { type: String, required: true },
    batch: { type: Schema.Types.ObjectId, required: true,ref: 'Batch' },
},{ timestamps: true })
export default mongoose.models.InAppNotification || mongoose.model("InAppNotification",InAppNotificationSchema);