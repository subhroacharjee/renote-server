import express from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

const router = express.Router();

router.post('/register', controllers.UserControllers.Register);
router.post('/login', controllers.UserControllers.Login);
router.get('/user', middlewares.AuthMiddleWare, controllers.UserControllers.getUser);
router.post('/change-password', middlewares.AuthMiddleWare, controllers.UserControllers.changePassword);
router.post('/register/firebase',controllers.UserControllers.registerWithFirebaseUser);
router.post('/login/firebase',controllers.UserControllers.loginWithFirebase);
export default router;