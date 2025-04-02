import jwt from "jsonwebtoken";
const AuthorizeMd = (token) => {
  try {
    let verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      return {status:true,email:verify.email};
    } else {
      return {status:false};
    }
  } catch (err) {
    return {status:false};
  }
};
export default AuthorizeMd;
