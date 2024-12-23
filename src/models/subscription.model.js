import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    // subscriber will be a user
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
    // channel is also a user
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)