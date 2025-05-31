// services/auth.service.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.config.js"

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
    if (!user) throw new Error("Invalid username ");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "6d",
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

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOtpToEmail(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const otp = this.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    console.log("user.otp:", user.otp);
    console.log("user.otpExpiresAt:", user.otpExpiresAt);


    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã có hiệu lực trong 5 phút.</p>`,
    });

    return { message: "Đã gửi OTP tới email." };
  }

  static async verifyOtpAndResetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });

    console.log("user.otp:", user.otp);
    console.log("user.otpExpiresAt:", user.otpExpiresAt);


    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiresAt
    ) {
      throw new Error(user.otpExpiresAt);
    }
    if(user.otpExpiresAt < new Date()) {
      throw new Error("OTP đã hết hạn");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { message: "Mật khẩu đã được đặt lại thành công" };
  }
}
