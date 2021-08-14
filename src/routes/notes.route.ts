import express from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

const router = express.Router();

router.post('/',middlewares.AuthMiddleWare,controllers.NoteControllers.addNotes);
router.get('/',middlewares.AuthMiddleWare, controllers.NoteControllers.getAllNotes);
router.get('/:id',middlewares.AuthMiddleWare,controllers.NoteControllers.getNote);
router.delete('/:id', middlewares.AuthMiddleWare,controllers.NoteControllers.deleteNote);
router.put('/:id', middlewares.AuthMiddleWare, controllers.NoteControllers.editNote);

export default router;