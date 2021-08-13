import express from "express";
import UserRouter from "./users.route";

var mainRouter = express.Router();

mainRouter.use('/auth',UserRouter);

export default mainRouter;

