import jsonwebtoken from 'jsonwebtoken';
import bcrypt from "bcrypt";
import env from './env';
const SECRET_KEY = env.SECRET_KEY || '28482B4D6251655468576D5A7134743777397A24432646294A404E635266556A586E3272357538782F413F442A472D4B6150645367566B597033733676397924';

/**
 * 
 * @param payload will be userObject
 * @param exp optional paramter which tells us if the we want to overwrite the exp time
 * @returns token
 */
export function createJWT(payload:any,exp:string|null=null) {
    return jsonwebtoken.sign(payload,SECRET_KEY,{
        expiresIn: exp||'30d'
    });
}

/**
 * 
 * @param token is the token from header
 * @returns an object containing either token attribute or error attribute
 */
export function decodeJWT(token:string) {
    const resp:any = {};

    try {
        resp.token = jsonwebtoken.verify(token,SECRET_KEY );
    } catch (error) {
        console.error(error);
        resp.error = 'Invalid Token'
    }

    return resp;
}

/**
 * 
 * @param password takes the user password and hashes it
 * @returns hashed password
 */
export function createHash(password:string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}


/**
 * 
 * @param hash the password hash
 * @param password plain text password
 * @returns true if the password matches else returns false
 */
export function checkHash(hash:string, password:string) {
    return bcrypt.compareSync(password, hash);
}