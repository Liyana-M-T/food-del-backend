import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config()

 export const connectDB = async () => {
    const connectionUrl = process.env.CONNECTION_STRING

    try{
        const connect = await mongoose.connect(connectionUrl);
        console.log("database connected: ",
            connect.connection.host,
            connect.connection.name);
        }catch(err){
            console.log(err);
            process.exit(1)
        }    
     
}