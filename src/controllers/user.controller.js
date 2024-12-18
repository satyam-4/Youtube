import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

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
    const coverImageLocalPath = req.files?.coverImage[0]?.path

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

export { registerUser }