import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
 import authRoutes from "./routers/auth.js"
 import userRoutes from "./routers/users.js"
 import DonarsInfoRoutes from "./routers/Donar.js"
dotenv.config();

const PORT = 4000;
const app = express();
app.use(cors())
app.use(express.json())

console.log("mongodb connected " + process.env.MONGODBURI);

mongoose.connect(process.env.MONGODBURI)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

  

app.get("/", (req, res) => {
  res.status(200).send("server is running saifullah");
  console.log("get cont");
});
app.use("/auth" , authRoutes)
app.use("/user" , userRoutes)
app.use("/donarsinfo" , DonarsInfoRoutes)

app.listen(PORT, () => {
  console.log("connected api");
});
