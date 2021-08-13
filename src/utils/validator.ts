import models from "../models"

export function validateEmail(email:string):boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password:string):boolean {
    return password.trim().length > 0 && password.length > 8;
}

export async function checkUserWithEmail (email:string) {
    var user =await models.UserModel.findOne({email:email}).exec();
    return !user?false:true;
}