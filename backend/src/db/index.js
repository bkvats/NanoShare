import mongoose from "mongoose";

export default async function dbConnect() {
    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_URI}/nanoshare`);
        console.log("Database connected successfully ::", dbConnection.connection.host);
    }
    catch (error) {
        console.log("An error occured while connecting to database:", error.message);
        // process.exit(1);
    }
}