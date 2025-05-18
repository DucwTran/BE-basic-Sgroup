import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async register(req, res) {
    const { fullName, address, email, password, gender, phone, age } = req.body;
    const result = await AuthService.register({
      fullName,
      address,
      email,
      password,
      gender,
      phone,
      age,
    });
    return res.status(201).json(result);
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      data: { accessToken },
      message: "Login successfully",
    });
  }

  static async processNewToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("Không có refreshToken");

    const { newAccessToken, newRefreshToken } =
      await AuthService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      data: { accessToken: newAccessToken },
      message: "Cấp accessToken mới thành công",
    });
  }

  static async logout(req, res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 0,
    });

    return res.status(200).json({ message: "Logout thành công" });
  }

  static async forgotPassword (req, res) {
    const { email } = req.body;
    const result = await AuthService.sendOtpToEmail(email);
    res.json(result);
  };

  static async verifyOtp (req, res) {
    const { email, otp, newPassword } = req.body;
    const result = await AuthService.verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({
      message: "reset password success",
    });
  };
}

export default AuthController;
