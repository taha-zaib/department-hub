import express from "express"
import connectDB from './config/database.js'
import "dotenv/config"
import handleDatabaseErrors from "./middleware/databaseErrorHandler.js";

const app = express();

// middleware to parse JSON
app.use(express.json())

// connection of mongoDB database
connectDB();


// routes - test endpoint
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!",
        database: "Connected to MongoDB"
    })
})

// database error handler
app.use(handleDatabaseErrors)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})