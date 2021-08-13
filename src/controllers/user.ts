import { Request, Response } from "express";
import * as Hash from "../utils/hash";
import * as firebase from "../utils/firebase";
import * as interfaces from "../utils/interfaces";
import * as validator from '../utils/validator';
import * as constants from '../utils/constants';
import * as functions from '../utils/function';
import models from "../models";
import { flattenDiagnosticMessageText } from "typescript";

export async function Register( req:Request, res:Response) {
    try {
        var response: interfaces.RespINF = {
            success:false
        };
        var email = req.body.email;
        var password = req.body.password;

        if (!validator.validateEmail(email)) {
            response.error = constants.EMAIL_INVALID;
            return res.json(response);
        }
        if (!validator.validatePassword(password)) {
            response.error = constants.PASSWORD_INVALID;
            return res.json(response);
        }
        if(await validator.checkUserWithEmail(email)) {
            response.error = constants.EMAIL_EXISTS;
            return res.json(response);
        }

        const newUserData:interfaces.UserDataInterface = {
            email:email,
            password:Hash.createHash(password),
            provider:constants.EMAIL_PROVIDER,
            created_at: new Date()
        }

        const newUser = new models.UserModel(newUserData);
        var payload = await newUser.save();
        var userDisplayObject: interfaces.UserDisplayInf = {
            id: payload._id,
            email: payload.email,
            provider: payload.provider,
            created_at: new Date(payload.created_at).toISOString()
        }
        var token = Hash.createJWT(userDisplayObject);

        response.body= {
            user: userDisplayObject,
            access_token: token
        }

        response.success = true

        return res.json(response);

    } catch (error) {
        console.log(error);
        const errRes: interfaces.RespINF = {
            'success':false,
            'error':constants.SOMETHING_WENT_WRONG
        }
        return res.json(errRes);
    }
}

export async function Login(req:Request, res:Response) {
    try {
        var response: interfaces.RespINF = {
            success:false
        };
        var email = req.body.email;
        var password = req.body.password;

        if (!validator.validateEmail(email)) {
            response.error = constants.EMAIL_INVALID;
            return res.json(response);
        }
        if (!validator.validatePassword(password)) {
            response.error = constants.PASSWORD_INVALID;
            return res.json(response);
        }
        if(!await validator.checkUserWithEmail(email)) {
            response.error = constants.EMAIL_DOEST_EXISTS;
            return res.json(response);
        }

        const user = await models.UserModel.findOne({email:email}).exec();

        if (!user) {
            response.error = constants.EMAIL_DOEST_EXISTS;
            return res.json(response);
        }
        if (user.provider !== constants.EMAIL_PROVIDER) {
            response.error = constants.EMAIL_DOEST_EXISTS;
            return res.json(response);
        }
        
        if (!Hash.checkHash(user.password||"", password)) {
            response.error = constants.PASSWORD_DOEST_MATCH;
            return res.json(response);
        }

        var userDisplayObject : interfaces.UserDisplayInf = functions.createUserDisplayData(user);
        var token = Hash.createJWT(userDisplayObject);

        response.body= {
            user: userDisplayObject,
            access_token: token
        }

        response.success = true
        return res.json(response);
        
    } catch (error) {
        console.log(error);
        const errRes: interfaces.RespINF = {
            'success':false,
            'error':constants.SOMETHING_WENT_WRONG
        }
        return res.json(errRes);
    }
}

export async function getUser(req:Request, res:Response) {
    try {
        const {payload} = Hash.decodeJWT(req.headers.authorization? req.headers.authorization.split(' ')[1]:'');
        var user = await models.UserModel.findOne({email: payload.email}).exec();
        if (!user) throw new Error('No User');

        var userDisplayObject : interfaces.UserDisplayInf = functions.createUserDisplayData(user);
        var response : interfaces.RespINF = {
            success: true,
            body: {
                user: userDisplayObject
            }
        }

        return res.json(response);
    } catch (error) {

        console.log(error);
        const errRes : interfaces.RespINF = {
            success: false,
            'error': constants.SOMETHING_WENT_WRONG
        };
        return res.json(errRes);
    }
}

export async function changePassword (req:Request, res:Response) {
    try {
        var response : interfaces.RespINF = {
            success: false
        }
        const {payload} = Hash.decodeJWT(req.headers.authorization? req.headers.authorization.split(' ')[1]:'');
        var user = await models.UserModel.findOne({email: payload.email}).exec();
        if (!user) throw new Error('No User');

        var oldPassword = req.body.password;
        var newPassword = req.body.newPassword;
        var flag = false;

        if (user.provider === constants.EMAIL_PROVIDER) {
            flag  = Hash.checkHash(user.password || '' , oldPassword);
        }
        else if (user.provider === constants.GOOGLE_PROVIDER) {
            if (user.password) {
                flag = Hash.checkHash (user.password || '', oldPassword);
            } else {
                flag = true;
            }
        }

        if (!flag) {
            response.error = constants.WRONG_PASSORD;
            return res.json(response);
        }

        user.password = Hash.createHash(newPassword);
        await user.save();
        response.success = true;

        return res.json(response);
    } catch (error) {
        console.log(error);
        const errRes : interfaces.RespINF = {
            success: false,
            'error': constants.SOMETHING_WENT_WRONG
        };
        return res.json(errRes);
    }
}

export async function registerFirebaseUser (req: Request, res: Response) {
    try {
        const response : interfaces.RespINF = {
            success: flattenDiagnosticMessageText
        }
        const idToken = req.body.idToken;
        if (!idToken) {
            response.error = constants.IDTOKEN_REQUIRED;
            return res.json(response);
        }

        const firebaseUser = await firebase.getFirebaseUserFromIdToken(idToken);
        if (!firebaseUser) {
            response.error = constants.INVALID_TOKEN;
            return res.json(response);
        }
        var uid = firebaseUser.uid;
        
        if (await validator.checkUserWithUID(uid)) {
            response.error = constants.PROVIDER_USER_EXISTS
            return res.json(response);
        }

        var userData: interfaces.UserDataInterface = {
            email: firebaseUser.email || '',
            uid: firebaseUser.uid,
            created_at: new Date(),
            provider: constants.GOOGLE_PROVIDER
        }

        const newUser = new models.UserModel(userData);
        await newUser.save();

        const userDisplay: interfaces.UserDisplayInf = functions.createUserDisplayData(newUser);

        const token = Hash.createJWT(userDisplay);

        response.success = true;
        response.body = {
            user: userDisplay,
            access_token: token
        };

        return res.json(response);

    } catch (error) {
        console.log(error);
        const errRes : interfaces.RespINF = {
            success: false,
            'error': constants.SOMETHING_WENT_WRONG
        };
        return res.json(errRes);
    }
}