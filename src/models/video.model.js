import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String,  // we can store the video file in the db, but it is not a good practice, so we store the url of the video file that we get from cloudinary
        required: true
    },
    thumbnail: {
        type: String,  // url of thumbnail
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,  // ye bhi hume cloudinary se mill jayega
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Video = mongoose.model("Video", videoSchema);