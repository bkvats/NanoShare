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
    receivers: {
        type: [
            {
                type: String,
                required: true,
                unique: true
            }
        ]
    }
}, {timestamps: true});

export const AccessCode = mongoose.model("AccessCode", accessCodeSchema);