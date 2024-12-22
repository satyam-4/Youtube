import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username is already taken"],
        lowercase: [true, "username should be in lowercase"],
        trim: true,  // this will automatically remove extra spaces at starting and ending of a string , ONLY WORKS FOR A STRING
        index: true  // improve query performance and more, but you have to trade off with storage space, slower write operations, etc.
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exists"],
        lowercase: [true, "email should be in lowercase"],
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "fullname is required"],
        trim: true,
        index: true
    },
    avatar: {
        type: String,  // cloudinary url
        required: true
    },
    coverImage: {
        type: String    // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "password is required"],
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

// pre is a function that is available on schemas and this function is used to write middlewares, this function takes 2 parameters, first the hook or middleware type that specifies the lifecycle event of the model on which the middleware will be triggered.
// this will encrypt the password before saving it in the database
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// method to check the password correct or not
// iss method ko jo password pass karoge, uss password ko ye hashed password se compare krega
userSchema.methods.isPasswordCorrect = async function(password) {
    console.log(this)
    return await bcrypt.compare(password, this.password)
}

// method to generate jwt access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        // payloads
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,  // secret key
        // expiry object
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// method to generate jwt refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        // payloads
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,  // secret key
        // expiry object
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)