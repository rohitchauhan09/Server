import customError from "../Utils/Error.js";
import jwt from "jsonwebtoken";
// export const authChecker = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt
//         console.log(token)
//         if(!token) {
//             throw new customError(401,"Invalid Error")
//         }

//         const decoded = jwt.verify(token, "rohit")
//         if (!decoded) {
//             throw new customError(401, "Invalid token");
//         }
//         console.log("user",decoded);
//         req.user = decoded
//         next()

//     } catch (error) {
//         console.log(error)
//         next(error.message)
//     }

// }

export const authChecker = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    // console.log(token);
    if (!token) {
      throw new customError(401, "Invalid Error");
    }

    const decoded = jwt.verify(token,"rohit");
    if (!decoded) {
      throw new customError(401, "Invalid token");
    }
    console.log("user", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    next(error)
  }
};
