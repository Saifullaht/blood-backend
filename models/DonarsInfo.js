import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for donor information
const donorsInfoSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true, // Optional: Add an index for faster searches
    },
    fullname: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Validate international phone number format (e.g., +923001234567)
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          // Ensure the date of birth is not in the future
          return v <= new Date();
        },
        message: (props) => `Date of birth ${props.value} cannot be in the future!`,
      },
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    donationsCount: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
      min: 18, // Minimum age for eligibility
      max: 65, // Maximum age for eligibility
      required: true,
    },
    weight: {
      type: Number,
      min: 50, // Minimum weight for eligibility (in kilograms)
      required: true,
    },
  },
  {
    timestamps: true,  
  }
);

// Create the model for donors
const Donor = mongoose.model("Donor", donorsInfoSchema);

export default Donor;
