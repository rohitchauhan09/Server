import { User } from "../Models/user.models.js";
import bcrypt from "bcrypt";
import { signupVerificationMail } from "../Email Template/mailtemplate.js";
import { sendEMail } from "../Services/nodemailer.js";
import crypto from "crypto";
import { otpTemplate } from "../Email Template/otptemplate.js";
import customError from "../Utils/Error.js";
import jwt from "jsonwebtoken"

//sign up controller
const signupController = async (req, res) => {
  const { name, email, phone, category, password } = req.body;
  if (!name || !email || !phone || !category || !password) {
    // return res.status(400).json({ message: "All field are required" });
    throw new customError(400, "All field are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // return res.status(400).json({ message: "Email already exists" });
    throw new customError(400, "Email already exists");
  }

  ///////// token generation for verification //////////
  const mailToken = crypto.randomBytes(12).toString("hex");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    phone,
    category,
    password: hashedPassword,
    mailToken,
  });

  await user.save();

  ////////getting users id ///////////////
  const signedUpUser = await User.findOne({ email });
  const id = signedUpUser._id;
  const savedMailToken = signedUpUser.mailToken;
  console.log("user:", signedUpUser, "userDetails:", id, savedMailToken);

  //////////send Verification mail to the user ///////////
  const subject = "Email Verification from the User";
  sendEMail(
    email,
    subject,
    signupVerificationMail.replace(
      "{verification_link}",
      `http://localhost:3000/api/mailverification/${id}/${mailToken}`
    )
  );
  return res.status(201).json({ message: "User Signed up successfully" });
};

// mail Verification

const mailVerificationController = async (req, res) => {
  const { id, mailToken } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      // return res.status(400).json({ message: "User not found" });
      throw new customError(400, "User not found");
    }

    console.log("User found:", user);
    if (user.mailToken !== mailToken) {
      // return res.status(400).json({ message: "Invalid Token" });
      throw new customError(400, "Invalid Token");
    }

    user.isVerified = true;
    user.mailToken = null;
    await user.save();

    console.log("User verification successful");
    res.redirect("http://localhost:5173/mailverified");
  } catch (error) {
    res.redirect("http://localhost:5173/mailnotverified");
  }
};

// loginController

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // return res.status(400).json({ message: "All field are required" });
    throw new customError(400, "All field are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError(400, "User not found");
  }

  if (user.email !== email) {
    throw new customError(400, "Invalid Email");
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    // return res.status(400).json({ message: "Invalid Password" });
    throw new customError(400, "Invalid Password");
  } 


  // create jwt token 
  const token = jwt.sign({ name: user.name, id: user._id }, "rohit", {expiresIn : "3h"});
  // console.log(token)

  // res.cookie("Jwt", token);

  // getting token as an header 
  res.setHeader("authorization",`Bearer ${token}`)

 res.status(200).json({
   message: "User Logged in successfully",
   userId: user._id, 
   email: user.email,
   username: user.name,
 });

};

//sendOtpController

const sendOtpController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    // return res.status(400).json({ message: "All field are required" });
    throw new customError(400, "All field are required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    // return res.status(400).json({ message: "Invalid Email" });
    throw new customError(400, "Invalid Email");
  }

  //generating otp
  const otp = Math.floor(100000 + Math.random() * 900000);

  // console.log("OTP:", otp);
  //saving otp

  user.otp = otp;
  await user.save();

  // sending otp to the user
  sendEMail(email, "Password reset Otp", otpTemplate.replace("{otp}", otp));
  res.status(200).json({ message: "Otp sent successfully" });
}
// verifyOtpController

const verifyOtpController = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    // return res.status(400).json({ message: "All field are required" });
    throw new customError(400, "All fields are required");
  }
  const user = await User.findOne({ email });

  if (user.otp !== otp) {
    throw new customError(400, "Invalid OTP");
  }

  user.otp = null;
  await user.save();
  res.status(200).json({ message: "Otp verified sucessfully" });
};

// password  reset controller
const passwordResetController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // return res.status(400).json({ message: "All field are required" });
    throw new customError(400, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    // return res.status(400).json({ message: "Invalid Email" });
    throw new customError(400, "Invalid Email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "Password reset sucessfully" });
};

const getUserDataController = async (req, res) => {
  const { id } = req.params
  const existingUser = await User.findById(id).populate("createdBlogs")
  if (!existingUser) {
    res.status(404).json({"message": "No User Found"})
  }

  res.status(201).json({ "message": "sucesss",existingUser })
  
}

// populate("Created Blogs")



export {
  signupController,
  mailVerificationController,
  loginController,
  sendOtpController,
  verifyOtpController,
  passwordResetController,
  getUserDataController
};
