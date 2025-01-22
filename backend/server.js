require("dotenv").config();
const connectDb = require("./lib/db")
const cors = require("cors");
const path = require("path")
const express = require("express");
const cookieParser = require("cookie-parser")

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.route");
const { app, server } = require("./lib/socket");

const __dirname = path.resolve()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
if (process.env.NODE_ENV = "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  })
}
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server is runnig on ${PORT}`);
  connectDb()
})