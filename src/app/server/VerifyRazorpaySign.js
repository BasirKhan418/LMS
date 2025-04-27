import * as crypto from "crypto"
import Razorpay from "razorpay"
const VerifyRazorpaySign = async (razorpay_order_id, razorpay_payment_id,razorpay_signature) => {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;     
  
    // STEP 8: Verification & Send Response to User
      
    // Creating hmac object 
    let hmac = crypto.createHmac('sha256', key_secret); 
  
    // Passing the data to be hashed
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      
    // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
      
      
    if(razorpay_signature===generated_signature){
        return {status:true,message:"Payment Successfull"};
    }
    else{
        return {status:false,message:"Payment Failed"};
    }
}
export default VerifyRazorpaySign;