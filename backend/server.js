

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const apiRouter = require('./Routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Correct middleware order
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Allow frontend to send cookies (CORS setup)
app.use(
  cors({
    origin: [
      "http://localhost:5173",  
       "https://recipe-blog-gules-two.vercel.app/"
    ],       // local development
   // deployed frontend // match your React dev server
    credentials: true, // REQUIRED to allow cookies
  })
);

// ✅ Connect to MongoDB
connectDB();

// ✅ Mount main API router
app.use('/api', apiRouter);

// ✅ Health check route (optional for debugging)
app.get("/", (req, res) => {
  res.send("Server is running and CORS/cookies are configured correctly!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
