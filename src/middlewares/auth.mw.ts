import { Request, Response, NextFunction } from "express";
import * as Hash from "../utils/hash";
import * as Validators from "../utils/validator";

export default async function Auth(req:Request, res:Response, next:NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("Forbidden"); 

        var token = authHeader.split('Bearer ')[1];
        try {
            var { payload } = Hash.decodeJWT(token);
        } catch(err) {
            console.log(err);
            return res.status(401).send();
        }
        

        if (!payload) throw new Error("Forbidden");
        
        if(!await Validators.checkUserWithEmail(payload.email)) throw new Error("Forbidden");

        next();

    } catch (error) {
        console.error(error);
        return res.status(401).send();
    }
}

