import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
// import userRouter from './routes/user.route.js'
import appointmentRoutes from './routes/appointment.routes.js'

import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import cookieParser from 'cookie-parser';


const app = express()

dotenv.config()

connectDB()

app.use(cookieParser());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API running and connected DB')
})



//////appointment
app.use("/api/v1/appointments", appointmentRoutes);


//////////auth
app.use("/api/v1/auth", authRoutes);

/////////admin
app.use("/api/v1/admin", adminRoutes);



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})