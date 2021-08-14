import express from "express";
import UserRouter from "./users.route";
import NoteRouter from './notes.route';

var mainRouter = express.Router();

mainRouter.use('/auth',UserRouter);
mainRouter.use('/notes',NoteRouter);

export default mainRouter;

