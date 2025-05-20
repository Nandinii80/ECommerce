import jwt from 'jsonwebtoken';


const authUser = async(req,res,next)=>{
    const {token} = req.cookies ;
    if(!token){
        return res.json({success:false, message:"not Authorized"})
    }
    try{
      const tokenDecode = jwt.verify(token,process.env.JWT_SEC)
      if(tokenDecode.id){
        req.user = { _id: tokenDecode.id };       }
      else{
        return res.json({success: false, message:'Not Authorized'})
      }
      next();
    }
    catch(error){
        res.json({success:false, message:error.message})
    }
}
export default authUser;