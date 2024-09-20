import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const db = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log('MongoDb Connected');

        })
        connection.on('error', (err) => {
            console.log('Db Connection Failed' + err);
            process.exit()
        })
    } catch (error) {
        console.log(`Db connect failed`, error.message);

    }
}