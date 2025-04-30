import mongoose from "mongoose";
const SocialMediaPostSchema = new mongoose.Schema({
userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
batchid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
links:{type:Array,required:true},
}, { timestamps: true });
export default mongoose.models.SocialMediaPost || mongoose.model('SocialMediaPost', SocialMediaPostSchema);
