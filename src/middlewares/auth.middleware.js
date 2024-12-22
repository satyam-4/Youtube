import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler( async (req, res, next) => {
    const token = req.cookies?.access_token
    // console.log(req.cookies.access_token)
    if(!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // jwt access token ko generate krte vqt jinn payloads ka use kiya tha, after verifying vahi decode krke return ho jayega 

    // console.log(decodedToken)

    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
    )

    if(!user) {
        throw new ApiError(401, "Invalid Acess Token")
    }

    req.user = user
    next()
} )
