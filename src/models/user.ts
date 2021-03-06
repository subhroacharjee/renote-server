import { Schema, SchemaTypes, model } from "mongoose";
import { UserDataInterface } from "../utils/interfaces";
import * as Constants from "../utils/constants";

const userSchema = new Schema<UserDataInterface>({
    email: {
        type:SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type:SchemaTypes.String,
        required:false,
        default:null
    },
    provider: {
        type:SchemaTypes.String,
        default: Constants.EMAIL_PROVIDER
    },
    uid: {
        type:SchemaTypes.String,
        default:null
    },
    created_at: {
        type:SchemaTypes.Date,
        default: new Date()
    }
});

export default model<UserDataInterface>("users",userSchema);