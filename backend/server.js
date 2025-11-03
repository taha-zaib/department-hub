import express from 'express'
import connectDB from './config/database.js'
import 'dotenv/config'
import handleDatabaseErrors from './middleware/databaseErrorHandler.js';
import departmentRoutes from './routes/departmentRoutes.js'
import mongoose from 'mongoose';

const app = express();


// connect to mongoDB database
connectDB();


// middleware to parse JSON
app.use(express.json())


// DEPARTMENT ROUTES
app.use('/api/departments', departmentRoutes)


// test endpoint
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!",
        database: "Connected to MongoDB"
    })
})


// DATABASE ERROR HANDLER
app.use(handleDatabaseErrors)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})