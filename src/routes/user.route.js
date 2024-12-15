import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

// you will be shifted here when "/api/v1/users" is hitted
router.route("/register").post(registerUser)  // if "/api/v1/users/register" is hitted then the control will be forwarded to registerUser 

export default router