import { Request, Response, NextFunction } from "express";
import * as Hash from "../utils/hash";
import * as Validators from "../utils/validator";
import * as functions from '../utils/function';

export default async function Auth(req:Request, res:Response, next:NextFunction) {
    try {
        var payload = await functions.getUserDataFromHeader(req);
        
        if (!payload) throw new Error("Forbidden");
        
        if(!await Validators.checkUserWithEmail(payload.email)) throw new Error("Forbidden");

        next();

    } catch (error) {
        console.error(error);
        return res.status(401).send();
    }
}

