// services/auth.service.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  static async register(userData) {
    const { fullName, address, email, password, gender, phone, age } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã tồn tại");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    return {
      message: "Đăng ký thành công",
      user: { fullName, address, email, gender, phone, age },
    };
  }

  static async login(email, password) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid username or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid username or password");

    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  static async refreshAccessToken(refreshToken) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
        if (err) return reject(new Error("Refresh token không hợp lệ"));

        const user = await User.findById(decoded.id);
        if (!user) return reject(new Error("Người dùng không tồn tại"));

        const payload = { id: user.id, email: user.email };
        const newAccessToken = jwt.sign(payload, accessTokenSecret, {
          expiresIn: "15m",
        });
        const newRefreshToken = jwt.sign(payload, refreshTokenSecret, {
          expiresIn: "7d",
        });

        resolve({ newAccessToken, newRefreshToken });
      });
    });
  }
}
