import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required feild"],
    },
    email: {
      type: String,
      required: [true, "email is required feild"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "phone is required feild"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "category is required feild"],
    },
    password: {
      type: String,
      required: [true, "password is required feild"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    mailToken :{ 
      type: String,
      default:null,
    },
    otp: {
      type: String,
      default: null,
    },
    createdBlogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref :"Blog"
    },
    profilePic: {
        type: String,
       default: "",
      }
  },
  { timestamps: true }
);

export const User = mongoose.model("User",userSchema)