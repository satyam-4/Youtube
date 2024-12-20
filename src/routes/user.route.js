import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// you will be shifted here when "/api/v1/users" is hitted
// if "/api/v1/users/register" is hitted then the control will be forwarded to registerUser 
// below code ko likhne ke kai saare syntax hai
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",  // frontend par bhi yahi name hona chahiye
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)  

/*
    "YE SYNTAX SE TUM FAMILIER HO"

const uploadFields = upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
])

router.post("/register", uploadFields, registerUser)
*/

export default router