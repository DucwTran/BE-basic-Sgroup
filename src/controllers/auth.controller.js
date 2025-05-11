import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { simpleHash } from "../utils/hashSimple.js";

export class AuthController {
  static async register(req, res) {
    const { fullName, address, email, password, gender, phone, age } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Tạo user mới
      const newUser = new User({
        fullName,
        address,
        email,
        password: hashedPassword,
        gender,
        phone,
        age,
      });

      // Lưu vào database
      await newUser.save();

      // Trả về message khi đăng ký thành công
      res.status(201).json({
        message: "Đăng ký thành công",
        user: {
          fullName,
          address,
          email,
          gender,
          phone,
          age,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server, không thể đăng ký" });
    }
  }

  static async login(req, res) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(401)
          .json({ message: "Invalid username or password 1" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Invalid username or password 2" });

      const payload = { id: user.id, email: user.email };
      const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, refreshTokenSecret, {
        expiresIn: "7d",
      });

      res.cookie("refreshToken", refreshToken, {
        //Lưu refreshToken vào cookie trình duyệt.
        httpOnly: true, //frontend không thể truy cập qua JS (bảo mật). nhưng có thấy trong DevTools
        secure: false, //đặt true khi dùng HTTPS.
        sameSite: "strict", //giới hạn gửi cookie chỉ trong cùng domain.
        maxAge: 7 * 24 * 60 * 60 * 1000, //thời gian sống (miligiây) = 7 ngày.
      });

      return res.json({
        data: { accessToken },
        message: "Login successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async processNewToken(req, res) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "Không có refreshToken" });
      }

      // Xác thực refresh token
      jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Refresh token không hợp lệ" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Tạo token mới
        const payload = { id: user.id, email: user.email };
        const newAccessToken = jwt.sign(payload, accessTokenSecret, {
          expiresIn: "15m",
        });
        const newRefreshToken = jwt.sign(payload, refreshTokenSecret, {
          expiresIn: "7d",
        });

        // Gán refresh token mới vào cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false, // true nếu dùng HTTPS
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
          data: { accessToken: newAccessToken },
          message: "Cấp accessToken mới thành công",
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async logout(req, res) {
    try {
      // Xóa refreshToken khỏi cookie
      res.clearCookie("refreshToken", {
        httpOnly: true, // chỉ có thể truy cập từ server
        secure: false, // đặt true khi dùng HTTPS
        sameSite: "strict", // giúp tránh CSRF
        maxAge: 0, // thời gian sống của cookie = 0, làm cookie hết hạn ngay lập tức
      });

      return res.status(200).json({ message: "Logout thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi logout" });
    }
  }

  static async getUserInfo(req, res) {
    try {
      const userId = req.userId; // Lấy userId từ middleware checkAuth

      // Truy vấn thông tin người dùng từ cơ sở dữ liệu
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Trả về thông tin người dùng
      return res.json({
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Lỗi server khi lấy thông tin người dùng" });
    }
  }
}

export default AuthController;
