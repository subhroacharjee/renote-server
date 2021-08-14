import { Request, Response } from "express";
import models from "../models";
import * as functions from "../utils/function";
import * as constants from "../utils/constants";
import * as validator from "../utils/validator";
import * as interfaces from '../utils/interfaces';

export async function addNotes( req:Request, res: Response) {
    try {

        var repsonse: interfaces.RespINF = {
            success: false
        };

        var payload = await functions.getUserDataFromHeader(req);
        if (!payload) throw new Error('payload is invalid in addNotes endpoint');

        var title = req.body.title;
        var body = req.body.body;
        if (!title || title.trim().length === 0) {
            repsonse.error = constants.TITLE_REQUIRED;
            return res.json(repsonse);
        }

        console.log(payload);
        

        var newNoteData :interfaces.NotesDataInterface = {
            user: payload.id,
            title: title,
            body: body,
            created_at: new Date()
        }

        try {
            const newNote = new models.NoteModel(newNoteData);
            await newNote.save();
            repsonse.success = true;
            repsonse.body = {
                note: functions.createNoteDisplayData(newNote)
            }
            return res.json(repsonse);
        } catch (error) {
            console.log("Problem at creation of note");
            return res.json(functions.returnDefaultError(error));
        }


    } catch (error) {
        return res.json(functions.returnDefaultError(error))
    }
}

export async function getAllNotes (req:Request, res:Response) {
    try {
        const payload = await functions.getUserDataFromHeader(req);
        if (!payload) throw new Error('payload is invalid at getAllNote');

        var Notes = await models.NoteModel.find({
            user:payload.id
        }).sort({'created_at':-1}).exec();

        var notesAr = Notes.map((note)=>{
            return {
                id:note._id,
                title:note.title,
                body:note.body,
                created_at:note.created_at
            }
        });

        const response: interfaces.RespINF = {
            success: true,
            body:{
                notes:notesAr
            }
        }

        return res.json(response);
    } catch (error) {
        return res.json(functions.returnDefaultError(error));
    }
}

export async function getNote (req: Request, res:Response) {
    try {
        
        var response : interfaces.RespINF = {
            success: false
        };

        const payload = await functions.getUserDataFromHeader(req);
        if (!payload) throw new Error('payload is invalid at getAllNote');

        const note = await validator.checkPostOfUser(req.params.id || '',payload.id || '');
        if (!note) {
            return res.status(404).send();
        }

        const noteData = functions.createNoteDisplayData(note);

        response.success = true;
        response.body = {
            note: noteData
        }

        return res.json(response);

    } catch (error) {
        return  res.json(functions.returnDefaultError(error));
    }
}

export async function deleteNote(req: Request, res:Response) {
    try {
        
        var response : interfaces.RespINF = {
            success: false
        };

        const payload = await functions.getUserDataFromHeader(req);
        if (!payload) throw new Error('payload is invalid at getAllNote');

        const note = await validator.checkPostOfUser(req.params.id || '',payload.id || '');
        if (!note) {
            return res.status(404).send();
        }

        await note.delete()
        response.success = true;
        return res.json(response);

    } catch (error) {
        return  res.json(functions.returnDefaultError(error));
    }
}

export async function editNote(req: Request, res:Response) {
    try {
        
        var response : interfaces.RespINF = {
            success: false
        };

        const payload = await functions.getUserDataFromHeader(req);
        if (!payload) throw new Error('payload is invalid at getAllNote');

        const note = await validator.checkPostOfUser(req.params.id || '',payload.id || '');
        if (!note) {
            return res.status(404).send();
        }

        var title = req.body.title;
        var body = req.body.body;
        if (!title || title.trim().length === 0) {
            response.error = constants.TITLE_REQUIRED;
            return res.json(response);
        }

        note.title=title;
        note.body = body;
        await note.save();

        const noteData = functions.createNoteDisplayData(note);

        response.success = true;
        response.body = {
            note: noteData
        }

        return res.json(response);

    } catch (error) {
        return  res.json(functions.returnDefaultError(error));
    }
}