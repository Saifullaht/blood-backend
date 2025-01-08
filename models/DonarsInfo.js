import mongoose from "mongoose";

const { Schema } = mongoose;

const donorsInfoSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    dob: { type: Date, required: true }, // Changed to Date for better handling
    bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
    antibodies: { type: [String], default: [] }, // List of antibodies (e.g., "Anti-D")
    lastDonationDate: { type: Date },
    donationsCount: { type: Number, default: 0 },
    healthIssues: { type: String }, // Any health issues that might affect donation
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donors", donorsInfoSchema);

export default Donor;
