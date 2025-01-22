import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routers/users.js";
import DonarsInfoRoutes from "./routers/Donar.js";

dotenv.config();

const PORT = 3008;
const app = express();
app.use(cors());
app.use(express.json());

console.log("MongoDB URI=>", process.env.MONGODBURI);

mongoose.connect(process.env.MONGODBURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.status(200).send("Server is running Saifullah");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/donarsinfo", DonarsInfoRoutes);

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
