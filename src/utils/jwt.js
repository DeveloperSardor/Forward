import jwt from 'jsonwebtoken';
import config from 'config'

const jwt_secret = config.get('jwt_secret');

export  const SIGN = (payload) =>{
return jwt.sign(payload, jwt_secret)
}

export const VERIFY = (token) =>{
    return jwt.verify(token, jwt_secret)
}

