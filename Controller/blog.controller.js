import customError from "../Utils/Error.js";
import { Blog } from "../Models/blogs.models.js";
import { User } from "../Models/user.models.js";

const createBlogsController = async (req, res) => {
  const { title, category, content } = req.body;
  const { authorId } = req.params;

  if (!title || !category || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const blog = new Blog({ title, category, content, author: authorId });

  await blog.save();

  await User.findByIdAndUpdate(authorId, {
    $push: { createdBlogs: blog._id },
  });

  res.status(201).json({
    message: "Blog created successfully",
    blog,
  });
};

// get all  the blogs  controller

const getAllblogsController = async (req, res) => {
  const blogs = await Blog.find();
  res.status(201).json({ message: "success", blogs });
};

// delete the blog controller

const deleteblogController = async (req, res) => {
  const blogId = req.params.id;

  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  if (!deletedBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json({ message: "Blog deleted successfully" });
};

//edit blog controller

const editBlogController = async (req, res) => {
  const blogId = req.params.id;
  const { title, category, content } = req.body;
  const editedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      title,
      content,
      category,
    },
    { new: true }
  );
  if (!editedBlog) {
    throw new customError(400, "Blog not found");
  }
  res.status(201).json({ message: "Blog updated Sucessfully", editedBlog });
  await editedBlog.save();
};

//add comments Controlller

const addCommentsController = async (req, res) => {
  const { userId, blogId } = req.params;

  const { comment } = req.body;
  if (!comment) {
    throw new customError(400, "All field are required to process");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new customError(404, "No User Found");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new customError(404, "No User Found");
  }

  blog.comment.push({ user: userId, comment });
  await blog.save();
  return res.status(201).json({ message: "Comment added successfully", blog });
};

// controller for uplaod blog images
const uploadBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("blogId", id, "body", req.body,"reqfile",req.file);
    // Find the blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    blog.blogImage = req.file.path;
    await blog.save();

    res.json({
      message: "File uploaded successfully",
      filePath: req.file.path,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res
      .status(500)
      .json({ message: "Failed to upload file", error: error.message });
  }
};

// get all comments 

const getAllCommentsController = async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate("comment.user", "name email profilePic");
  if (!blog) {
    return res.status(404).json({ message: "Blog not Found" })
    
  }
  res.status(200).json({message: "sucess", blogComments: blog.comment})
}

export {
  createBlogsController,
  getAllblogsController,
  deleteblogController,
  editBlogController,
  addCommentsController,
  uploadBlogController,
  getAllCommentsController,
};
