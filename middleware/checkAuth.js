const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY
const { AuthenticationError } = require('apollo-server');


module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //Bearer ...
        const token = authHeader.split('Bearer ')[1];
        console.log(token);
        if(token){
            try {
                const user = jwt.verify(token, secretKey);
                return user;
            } catch (error) {
                throw new AuthenticationError('Invalid/expired token')
            }
        }else{
            throw new Error('Invalid token')
        }
    }else{
        throw new Error('Auth token must be provided')
    }
}