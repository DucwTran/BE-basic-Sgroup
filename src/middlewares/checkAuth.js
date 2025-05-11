import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Yêu cầu xác thực. Vui lòng đăng nhập.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, yêu cầu đăng nhập" });
  }

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET; // Hoặc accessTokenSecret tùy vào cách triển khai
  try {
    // Giải mã token và lấy thông tin người dùng
    const decoded = jwt.verify(token, refreshTokenSecret); // Đảm bảo sử dụng đúng secret key

    // Gán thông tin người dùng vào request để sử dụng ở các controller tiếp theo
    req.userId = decoded.id; // Giả sử bạn đã lưu userId trong payload của token

    next(); // Tiến hành tới các middleware/controller tiếp theo
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

export default checkAuth;
