import User from "../models/user.model.js";
import { simpleHash, simpleCompare } from "../utils/hashSimple.js";

export class AuthController {
  static async register(req, res) {
    const { fullName, address, email, password, gender, phone, age } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và password" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      const hashedPassword = simpleHash(password);

      const newUser = new User({
        fullName,
        address,
        email,
        password: hashedPassword,
        gender,
        phone,
        age,
      });

      await newUser.save();

      res.status(201).json({
        message: "Đăng ký thành công",
        user: {
          email,
          fullName,
          address,
          gender,
          phone,
          age,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và password" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user || !simpleCompare(password, user.password)) {
        return res.status(401).json({ message: "Sai email hoặc password" });
      }

      res.status(200).json({
        message: "Đăng nhập thành công",
        user: {
          fullName: user.fullName,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AuthController;
