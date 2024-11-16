import { mongoose } from "mongoose";

const accessCodeSchema = new mongoose.Schema({
    accessCode: {
        type: String,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        required: true,
        unique: true
    },
    isSending: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true});

export const AccessCode = mongoose.model("AccessCode", accessCodeSchema);