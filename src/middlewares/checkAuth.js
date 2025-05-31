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

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  try {
    const decoded = jwt.verify(token, accessTokenSecret);

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ message: "Token không chứa thông tin người dùng" });
    }
    req.role = decoded.role;
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export default checkAuth;
