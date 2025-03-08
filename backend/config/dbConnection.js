import mongoose from "mongoose";

const mongoDBConnection = async ()=>{
   mongoose.connection.on('connected', ()=>{
        console.log("DB CONNECTED")
    })

    await mongoose.connect("mongodb+srv://Shahadat:Shahadat123@cluster0.3gspl.mongodb.net/Campus360")
}

export default mongoDBConnection;