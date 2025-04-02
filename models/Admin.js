import mongoose from "mongoose";
const AdminSchema =  new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name:{type:String,required:true},
    password: {
        type: String,
        required: true
    },
    img:{type:String},
    email:{type:String,required:true},
    role:{type:String,default:"admin"},
    isforgot:{type:Boolean,default:true},
    linkedin:{type:String},
    github:{type:String},
    token:{type:String}
})
export default mongoose.models.Admin || mongoose.model("Admin",AdminSchema);