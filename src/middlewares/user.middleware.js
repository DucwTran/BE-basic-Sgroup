import { BadRequestError } from "../handlers/error.response.js";

class UserValidator {
  constructor() {}
  checkInput = async (req, res, next) => {
    try {
      const user = req.body;
      if (
        !user.age ||
        !user.email ||
        !user.fullName ||
        !user.password
      ) {
        throw new BadRequestError("Nhập thiếu thông tin!");
      }
      const age = parseInt(user.age);
      if (isNaN(age) || age <= 0 || age > 100) {
        throw new BadRequestError("Age is invalid");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = emailRegex.test(user.email);
      if (!checkEmail) {
        throw new BadRequestError("Email is invalid");
      }
      if (user.fullName.trim().length < 5) {
        throw new BadRequestError("Username must be at least 5 characters");
      }
      if (user.password.trim().length < 5) {
        throw new BadRequestError("Password must be at least 5 characters");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default UserValidator;
