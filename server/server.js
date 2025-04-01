const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path, stat) => {
      res.set("Access-Control-Allow-Origin", "*"); // Allow all origins for static files
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
    },
  })
);

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development frontend URL
      "https://sky-wings-app-git-main-vighneshparab83-gmailcoms-projects.vercel.app", // Deployed frontend URL
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://vighneshparab83:WWzQ2mQtX52z56wt@skywings.kpjamzc.mongodb.net/?retryWrites=true&w=majority&appName=SkyWings",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/instructor", instructorRoutes);

app.get("/", (req, res) => {
  res.send("SkyWings Backend is running!");
});

module.exports = app;
