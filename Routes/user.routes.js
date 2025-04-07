import express from "express";
import {
  signupController,
  mailVerificationController,
  loginController,
  sendOtpController,
  verifyOtpController,
  passwordResetController,
  getUserDataController,
} from "../Controller/user.controller.js";
import asyncHandler from "../Utils/AsyncHandler.js";
import { authChecker } from "../Middleware/authChecker.js";
import {
  createBlogsController,
  deleteblogController,
  getAllblogsController,
  editBlogController,
  addCommentsController,
  uploadBlogController,
  getAllCommentsController
} from "../Controller/blog.controller.js";
import { storage } from "../Services/multer.js";
import multer from "multer";
import { User } from "../Models/user.models.js";

export const Route = express.Router();

// signup route
Route.post("/signup", asyncHandler(signupController));

//Mail verification Route

// Route.post("/mailverification/:id/:mailToken", mailVerificationController);
Route.get(
  "/mailverification/:id/:mailToken",
  asyncHandler(mailVerificationController)
);

// login controller  Route
Route.post("/login", asyncHandler(loginController));

// sendOtp api Route

Route.post("/sendotp", authChecker, asyncHandler(sendOtpController));

//verifyOtp api Route

Route.post("/verifyotp", asyncHandler(verifyOtpController));

//password reset API
Route.post("/resetpassword", asyncHandler(passwordResetController));

// api for show data in  dashboard

Route.get("/getuserdata/:id", asyncHandler(getUserDataController));

//api to crate blogs
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // equals 5 mb
  },
});

Route.post(
  "/createblog/:authorId",
  upload.single("file"),
  asyncHandler(createBlogsController)
);

//api to get all blogs

Route.get("/getallblogs", asyncHandler(getAllblogsController));

//api to delete the Blogs

Route.delete("/deleteblog/:id", asyncHandler(deleteblogController));

// api to edit the blogs

Route.put("/editblog/:id", asyncHandler(editBlogController));

//api to add comments to the blogs

Route.post(
  "/addcomments/:userId/:blogId",
  authChecker,
  asyncHandler(addCommentsController)
);

// api to upload file

Route.post("/upload/:id", upload.single("file"), async (req, res, file) => {
  // console.log(req.file);
  const { id } = req.params;
  const user = await User.findById(id);
  user.profilePic = req.file.path;
  await user.save();
  res.json({
    message: "file uploaded suceessfully",
    filePath: req.file.path,
  });
});

// upload blogs images

Route.post("/uploadblog/:id", upload.single("file"), asyncHandler(uploadBlogController));

// get all comments 

Route.get("/getcomments/:blogId",asyncHandler(getAllCommentsController))
