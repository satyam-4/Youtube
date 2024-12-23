import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import fs from "fs"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
} 

const cleanupTempFiles = (filePaths) => {
    filePaths.forEach(path => {
        fs.unlink(path, (err) => {
            if(err) console.log(`Failed to delete file: ${err}`)
        })
    })
}

// to register user
const registerUser = asyncHandler( async (req, res) => {
    // steps to register a new user:
    // 1. get user details from frontend
    // 2. validation -> check if any required field is not empty, valid email, etc.
    // 3. check if user already exists -> unique username or email or both (depends)
    // 4. check for images and avatar
    // 5. upload them to cloudinary
    // 6. create user object (an object that contains all details of the user)
    // 7. save the object in database
    // 8. ab hume response me user details ko bhejna hai, lekin password and refresh token nahi bhejenge
    // 9. send the user detail as response

    // req.body me vo sara deta hoga jo form ya json me mill raha hai
    const { username, email, fullName, password } = req.body  // req.body ke data ko destructure kar liya

    // user ki details toh mill gayi, ab ye dekhna hai ki koi field empty hai ya nahi
    // checking each field like this will not be a professional code
    // if(username === "") {
    //     ApiError(400, "Username is required")
    // }
    
    if(
        [username, email, password, fullName].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exist
    // const existingUser = User.find({ email })  // find the user by his email
    const existingUser = await User.findOne({  // using `$` we can use multiple operators like or, and, etc. in or operator if any of the field (email, username) is present in the db then it will return it, iska mtlb ek username and email se ek he user register krega
        $or: [{ email }, { username }]
    })

    if(existingUser) {
        console.log(existingUser)
        throw new ApiError(409, "User already exists")  // throw the error with status code 409 that means Conflict
    }

    // ab images and avatar ko handle krna hai
    // iss function (registerUser) ke execution se pehele ek middleware chala hai multer wala, vo req me files ko bhi add krta hai
    // toh jaise express hume req me body ka access provide krta hai, multer ne req me he files bhi add krdiya, aur ye files vahi hai jinhe humne frontend se bheja tha
    const avatarLocalPath = req.files?.avatar[0]?.path  // console log req.files then it will make sense
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // avatar is required
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    // upload avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // check once again that avatar is successfully uploaded or not
    if(!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    // after the upload is done, remove the files from server
    // do it asynchronously, bcoz, it is not something on which upcoming operations depends
    // pass an error of paths and this function takes each path, and unlink the file asynchronously
    cleanupTempFiles([
        avatarLocalPath,
        coverImageLocalPath
    ])

    // saare details mill gaye, avatar and coverImage bhi cloudinary par upload ho gaye, ab db me entry krdo
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),  // db me username ko lower case me convert krke store krenge
        email,
        password,
        avatar: avatar.url,  // cloudinary jo respose send krega, usme se uss avatar ka url store kroonga db me
        coverImage: coverImage?.url || ""  // coverImage required toh nahi tha, toh ho skta hai ki naa ho, agr hai toh url store kr lo, otherwise empty rhne do
    })

    // user ki entry db me hui hai ya nahi, ye check krne ke liye, hum iss user ko create krne ke baad db me search kr skte hai by it's _id
    // Users collection me user._id ko find karo
    // although it is not good to make db calls for everything, we will optimize it, so we don't have to make a db query
    const createdUser = await User.findById(user._id).select(  // remember we have to send the details of the created user, but excluding password and refreshToken, in select method we can remove fields that we don't want
        "-password -refreshToken"  // jb user find kr loge by it's _id, tb hum select method ka use krke password and refreshToken remove krke variable me store krke response me send kr dege
    )  

    if(!createdUser) {
        throw new ApiError(500)  // the default mssg : "something went wrong" will be sent
    }

    // return res.status(201).json({ createdUser })  // earlier we were doing this, passing created user in a json response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")  
    )
} )

// to login user
const loginUser = asyncHandler( async (req, res) => {
    // steps to login an existing user
    // 1. get user details like username, email and password
    // 2. find the user based on it's username or email -> we will find by both
    // 3. check if password is correct
    // 4. create access and refresh token if everything is fine
    // 5. give error response on incorrect credentials

    // get the user credentials 
    const { username, email, password } = req.body

    // find the user
    const user = await User.findOne({
        $or: [{ username }, { email }]  // get the user if it exist by it's username or email
    })


    // check if user exist
    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    // console.log(user instanceof User)
    
    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(401, "Incorrect Password")
    }

    // generate access and refresh token
    // const accessToken = user.generateAccessToken()
    // const refreshToken = user.generateRefreshToken()
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // console.log(accessToken)
    // console.log(refreshToken)

    const loggedInUser = await User.findById(user._id)  // loggedInUser will contain refreshToken field, earlier user object will not contain that field

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 20000
    }

    // store these tokens in cookie
    return res
    .status(200)
    .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 20000
    })
    .cookie("refresh_token", refreshToken, options)
    .json(
        new ApiResponse(
            // status code
            200,  
            // data
            {
                loggedInUser,
                accessToken,
                refreshToken
            },
            // mssg
            "User Logged In Successfully"
        )
    )
} )

// to logout user
const logoutUser = asyncHandler( async (req, res) => {
    // console.log(req.user)
    
    // find and update the refreshToken field of the user, set it to undefined
    await User.findByIdAndUpdate(
        // the document _id that to be updated
        req.user._id,

        // the field that to be updated 
        {
            $set: {  // ye mongodb ka operator hai jo object leta hai containing fields and updated values
                refreshToken: undefined
            }
        },

        // this method also returns the document, by default it returns the old doc, but setting new to true, it will return the updated doc, btw we are not going to store it 
        {
            new: true
        }
    )

    // clear the tokens stored in cookies
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
} )

// to refresh the access token of a user
const refreshAccessToken = asyncHandler( async (req, res) => {
    // steps and working of this function to generate access and refresh token
    // 1. get the refresh token from cookies, this is the same token that was stored in db while login
    // 2. decode the token and get _id, now you can find the user by it's _id
    // 3. check if the refresh token coming from request and the stored one db are same or not, if equal then proceed
    // 4. generate new access and refresh token
    // 5. replace the newely generated refresh token from the old one
    const incomingRefreshToken = req.cookies?.refresh_token

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)

    // if someone sends incorrect refresh token then user will not found coz you don't get _id, then we throw the below error
    if(!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if(incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
    }

    const {newAccessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
    .status(200)
    .cookie("access_token", newAccessToken)
    .cookie("refresh_token", newRefreshToken)
    .json(
        new ApiResponse(
            200,
            {
                newAccessToken,
                newRefreshToken
            },
            "Access token refreshed"
        )
    )
} )

// to change the password of a user
const changeCurrentPassword = asyncHandler( async (req, res) => {
    // steps to change the password
    // 0. we will run the auth middleware before running this function, to make sure user is logged in before changing the password, that middleware will add user in request object, now i can find the user by it's _id
    // 1. take both old and new password from user
    // 2. if old password is correct (check from db), then change it with new password

    // take old and new password from request body
    const {oldPassword, newPassword} = req.body

    // find the user
    const user = await User.findById(req.user?._id)

    // as we have saved password in encrypted form in db, we cannot directly match it with the string provided, instead we can use the method that created in user schema to check the password
    // below method will return true if the oldPassword is correct
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid) {
        throw new ApiError(401, "Incorrect Old Password")
    }

    // if password is valid then reset the password
    user.password = newPassword

    // user schema me humne ek method banaya hai jo hr baar save hone se pehele chalega and if password is modified before saving then it will hash the pasword before saving it to db
    await user.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
} )

// to get the current user
const getCurrentUser = asyncHandler( async (req, res) => {
    // we will ensure that user is logged in before we get the user, so we'll run auth middleware that injects the some user details in the request object

    const user = await User.findById(req?.user._id).select(
        "-password -refreshToken"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Current user fetched successfully"
        )
    )
} )

// to update user avatar
const updateUserAvatar = asyncHandler( async (req, res) => {
    // to update the avatar we have to ensure user is logged in -> runs jwtVerify middleware
    // also we want the new avatar file, so multer middleware will also run before this controller

    // steps to update the avatar
    // 1. find the user
    // 2. check if avatar file is send in request
    // 3. update the avatar

    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
 
    if(!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    // at this point you have uploaded the avatar on cloudinary and you have access to the url, now you have to update the avatar url stored in db

    // find the user and 
    const user = await User.findByIdAndUpdate(
        // _id of the user
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select(
        "-password -refreshToken"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Avatar updated successfully"
        )
    )
} )

// to update user cover image
const updateUserCoverImage = asyncHandler( async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Cover image updated successfully"
        )
    )
} )

export { 
    registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage
}