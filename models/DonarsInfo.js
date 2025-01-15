import mongoose from "mongoose";

const { Schema } = mongoose;

const donorsInfoSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    phoneNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      validate: {
        validator: function (v) {
          // Simple regex to validate a phone number format (e.g., 10-15 digits)
          return /^\+?[1-9]\d{1,14}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    dob: { type: Date, required: true },
    bloodType: { 
      type: String, 
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 
      required: true 
    },
    antibodies: { type: [String], default: [] }, // List of antibodies (e.g., "Anti-D")
    lastDonationDate: { type: Date },
    donationsCount: { type: Number, default: 0 },
    healthIssues: { type: String }, // Any health issues that might affect donation
    profileCompleted: { type: Boolean, default: false },
    age: {
      type: Number,
      min: 18, // Minimum donor age
      max: 65, // Maximum donor age
      required: true,
    },
    weight: {
      type: Number,
      min: 50, // Minimum weight (in kilograms)
      required: true,
    },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donors", donorsInfoSchema);

export default Donor;
