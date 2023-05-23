export const checkToken = (req, res, next)=>{
try {
    let {token} = req.headers;

    if(!token){
        throw new Error(`You are not sent token from request headers❗`)
    }
    else{
        next()
    }
} catch (error) {
 res.send({
    message : `Error: ${error.message}`,
    status : 400,
    success : false
 })   
}
}