import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${mongoose.connection.host}`)
        console.log(`MongoDB Connected: ${mongoose.connection.name}`)
        return connect;
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default connectDB;