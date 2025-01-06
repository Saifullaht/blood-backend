import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = 2000;
const app = express();
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

app.listen(PORT, () => {
  console.log("connected api");
});
