import { Schema, SchemaTypes, model } from 'mongoose';
import * as interfaces from '../utils/interfaces';

const NoteSchema = new Schema<interfaces.NotesDataInterface>({
    user: {
        type: SchemaTypes.String,
        required: true,
        unique: false
    },
    title :{
        type: SchemaTypes.String,
        required: true
    },
    body: {
        type: SchemaTypes.String,
        required: false,
        default: null
    },
    created_at:{
        type: SchemaTypes.Date,
        default: new Date()
    }
});

export default model<interfaces.NotesDataInterface>('notes',NoteSchema);