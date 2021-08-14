import { Request } from 'express';
import * as constants from './constants';
import * as interfaces from './interfaces';
import * as Hash from './hash';

export function createUserDisplayData(user:any):interfaces.UserDisplayInf{
    return{
        id: user._id,
        email: user.email,
        provider: user.provider,
        created_at: new Date(user.created_at).toISOString()
    }

}

export function createNoteDisplayData(note:any):interfaces.NotesDisplayInterface{
    return {
        id: note.id,
        title: note.title,
        body: note.body,
        created_at: note.created_at
    }
}

export function returnDefaultError(error:any):interfaces.RespINF{
    console.log(error);
    return {
            success: false,
            'error': constants.SOMETHING_WENT_WRONG
    };
}

export async function getUserDataFromHeader (req:Request) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;
        var token = authHeader.split('Bearer ')[1];
        try {
            var { payload } = Hash.decodeJWT(token);
            return payload;
        } catch(err) {
            console.log(err);
            return null;
        }
}